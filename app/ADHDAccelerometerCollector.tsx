import * as FileSystem from "expo-file-system";
import { Accelerometer } from "expo-sensors";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ADHDAccelerometerCollector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [sessionData, setSessionData] = useState<
    { timestamp: string; activity: number; rawSampleCount: number }[]
  >([]);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Refs for data processing
  const accelerometerDataBuffer = useRef<
    { x: number; y: number; z: number; timestamp?: number }[]
  >([]);
  const epochStartTime = useRef<number | null>(null);
  const subscription = useRef<any>(null);
  const epochInterval = useRef<NodeJS.Timeout | number | null>(null);

  // Configuration matching the research parameters
  const CONFIG = {
    SAMPLING_FREQUENCY: 32, // Hz - matches research
    EPOCH_DURATION: 60000, // 60 seconds in milliseconds
    MOVEMENT_THRESHOLD: 0.05, // 0.05g threshold
    GRAVITY: 9.81, // for g-force calculations
  };
  const saveDataPeriodically = async () => {
    const data = JSON.stringify(sessionData);
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "backup_data.json",
      data
    );
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const calculateMovementIntensity = (
    accelerometerData: { x: number; y: number; z: number; timestamp?: number }[]
  ) => {
    if (accelerometerData.length === 0) return 0;

    let totalIntensity = 0;
    let validSamples = 0;

    for (const sample of accelerometerData) {
      // Calculate magnitude of acceleration vector
      const magnitude = Math.sqrt(
        sample.x * sample.x + sample.y * sample.y + sample.z * sample.z
      );

      // Apply threshold (movements over 0.05g)
      if (magnitude > CONFIG.MOVEMENT_THRESHOLD) {
        totalIntensity += magnitude;
        validSamples++;
      }
    }

    // Return intensity proportional to movement (scaled to match research values)
    // This scaling factor may need adjustment based on your specific requirements
    const scalingFactor = 100;
    return Math.round(
      (totalIntensity / Math.max(validSamples, 1)) * scalingFactor
    );
  };

  const processEpochData = () => {
    const intensity = calculateMovementIntensity(
      accelerometerDataBuffer.current
    );
    const timestamp = new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const formattedTimestamp = timestamp
      .replace(",", "")
      .replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, "$1-$2-$3 $4");

    const epochData = {
      timestamp: formattedTimestamp,
      activity: intensity,
      rawSampleCount: accelerometerDataBuffer.current.length,
    };

    setSessionData((prev) => [...prev, epochData]);
    setCurrentActivity(intensity);
    setTotalMinutes((prev) => prev + 1);

    // Clear buffer for next epoch
    accelerometerDataBuffer.current = [];

    console.log(`Epoch ${totalMinutes + 1}: Activity = ${intensity}`);
  };

  const startRecording = async () => {
    try {
      // Check if accelerometer is available
      const isAvailable = await Accelerometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Accelerometer not available on this device");
        return;
      }

      // Set update interval to match 32 Hz sampling
      Accelerometer.setUpdateInterval(1000 / CONFIG.SAMPLING_FREQUENCY);

      // Start collecting accelerometer data
      subscription.current = Accelerometer.addListener((accelerometerData) => {
        accelerometerDataBuffer.current.push({
          x: accelerometerData.x,
          y: accelerometerData.y,
          z: accelerometerData.z,
          timestamp: Date.now(),
        });
      });

      // Set up epoch processing (every minute)
      epochStartTime.current = Date.now();
      epochInterval.current = setInterval(() => {
        processEpochData();
      }, CONFIG.EPOCH_DURATION);

      setIsRecording(true);
      setSessionData([]);
      setTotalMinutes(0);

      Alert.alert(
        "Recording Started",
        "Accelerometer data collection has begun. Keep the device with you for accurate readings."
      );
    } catch (error) {
      console.error("Error starting recording:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error);
      Alert.alert("Error", "Failed to start recording: " + errorMessage);
    }
  };

  const stopRecording = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }

    if (epochInterval.current) {
      clearInterval(epochInterval.current);
      epochInterval.current = null;
    }

    // Process any remaining data in buffer
    if (accelerometerDataBuffer.current.length > 0) {
      processEpochData();
    }

    setIsRecording(false);
    Alert.alert(
      "Recording Stopped",
      `Session completed. Collected ${totalMinutes} minutes of data.`
    );
  };

  const exportData = async () => {
    if (sessionData.length === 0) {
      Alert.alert("No Data", "No data to export. Start recording first.");
      return;
    }

    try {
      // Create CSV content matching the research format
      const csvHeader = "TIMESTAMP;ACTIVITY\n";
      const csvData = sessionData
        .map((item) => `${item.timestamp};${item.activity}`)
        .join("\n");

      const csvContent = csvHeader + csvData;

      // Create filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const filename = `adhd_activity_data_${timestamp}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Export Complete", `Data saved to: ${filename}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error);
      Alert.alert("Export Error", "Failed to export data: " + errorMessage);
    }
  };

  const clearData = () => {
    Alert.alert(
      "Clear Data",
      "Are you sure you want to clear all collected data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setSessionData([]);
            setTotalMinutes(0);
            setCurrentActivity(0);
          },
        },
      ]
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>ADHD Activity Monitor</Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Duration:</Text>
            <Text style={styles.statusValue}>{totalMinutes} minutes</Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Current Activity:</Text>
            <Text style={styles.statusValue}>{currentActivity}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text
              style={[
                styles.statusValue,
                { color: isRecording ? "#4CAF50" : "#757575" },
              ]}
            >
              {isRecording ? "Recording" : "Stopped"}
            </Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isRecording ? styles.stopButton : styles.startButton,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={false}
          >
            <Text style={styles.buttonText}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exportButton]}
            onPress={exportData}
            disabled={sessionData.length === 0}
          >
            <Text style={styles.buttonText}>Export CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearData}
            disabled={sessionData.length === 0}
          >
            <Text style={styles.buttonText}>Clear Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Collection Settings</Text>
          <Text style={styles.infoText}>• Sampling Rate: 32 Hz</Text>
          <Text style={styles.infoText}>• Epoch Duration: 1 minute</Text>
          <Text style={styles.infoText}>• Movement Threshold: 0.05g</Text>
          <Text style={styles.infoText}>
            • Data Points: {sessionData.length}
          </Text>
        </View>

        {sessionData.length > 0 && (
          <View style={styles.dataPreview}>
            <Text style={styles.previewTitle}>Recent Data Preview</Text>
            <ScrollView
              style={styles.dataScroll}
              showsVerticalScrollIndicator={false}
            >
              {sessionData
                .slice(-10)
                .reverse()
                .map((item, index) => (
                  <View key={index} style={styles.dataRow}>
                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                    <Text style={styles.activityText}>{item.activity}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  statusContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
  },
  controlsContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  exportButton: {
    backgroundColor: "#FF9800",
  },
  clearButton: {
    backgroundColor: "#757575",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  dataPreview: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    flex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dataScroll: {
    flex: 1,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  timestampText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
  },
  activityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
});

export default ADHDAccelerometerCollector;
