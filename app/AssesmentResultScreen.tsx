import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const AssessmentResultScreen = () => {
  const overallScore = 42;
  const totalScore = 72;
  const riskLevel = "Moderate Risk";
  const riskDescription =
    "Your responses suggest moderate symptoms that warrant professional evaluation.";
  const categoryBreakdown = [
    { name: "Cardiovascular", score: 18, total: 24, color: "red" },
    { name: "Respiratory", score: 12, total: 20, color: "orange" },
    { name: "Neurological", score: 8, total: 16, color: "green" },
    { name: "General Health", score: 4, total: 12, color: "lightblue" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {/* Replace with your checkmark icon */}
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.title}>Assessment Complete</Text>
          <Text style={styles.subtitle}>
            Your health screening results are ready
          </Text>
        </View>

        <View style={styles.overallScoreCard}>
          <Text style={styles.overallScoreLabel}>Overall Score</Text>
          <View style={styles.riskBadge}>
            <Text style={styles.riskBadgeText}>{riskLevel}</Text>
          </View>
          <Text style={styles.score}>
            {overallScore}/{totalScore}
          </Text>
          <Text style={styles.assessmentScoreLabel}>Assessment Score</Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(overallScore / totalScore) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.riskDescription}>{riskDescription}</Text>
        </View>

        <View style={styles.categoryBreakdownCard}>
          <Text style={styles.categoryBreakdownTitle}>Category Breakdown</Text>
          {categoryBreakdown.map((category) => (
            <View key={category.name} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.categoryProgressBarBackground}>
                <View
                  style={[
                    styles.categoryProgressBarFill,
                    {
                      width: `${(category.score / category.total) * 100}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.categoryScore}>
                {category.score}/{category.total}
              </Text>
            </View>
          ))}
        </View>

        {/* You can add the "Recommendations" section here */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          {/* Add your recommendation content */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Adjust background color
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  checkmarkCircle: {
    backgroundColor: "#e6f9e6", // Light green background
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  checkmark: {
    color: "#27ae60", // Green checkmark color
    fontSize: 30,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  overallScoreCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  overallScoreLabel: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  riskBadge: {
    backgroundColor: "#f9e79f", // Light yellow
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  riskBadgeText: {
    color: "#9e6f23", // Dark yellow
    fontWeight: "bold",
    fontSize: 14,
  },
  score: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  assessmentScoreLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  progressBarBackground: {
    backgroundColor: "#ddd",
    height: 10,
    borderRadius: 5,
    width: "80%",
    marginBottom: 15,
  },
  progressBarFill: {
    backgroundColor: "black",
    height: 10,
    borderRadius: 5,
  },
  riskDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  categoryBreakdownCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryBreakdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  categoryProgressBarBackground: {
    backgroundColor: "#eee",
    height: 8,
    borderRadius: 4,
    width: "70%",
    marginRight: 10,
  },
  categoryProgressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  categoryScore: {
    fontSize: 14,
    color: "#777",
    position: "absolute",
    right: 0,
    top: 0,
  },
  recommendationsCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
});

export default AssessmentResultScreen;
