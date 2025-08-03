import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Get the screen width for responsive design
const { width } = Dimensions.get("window");

const QuestionScreen = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Hardcoded question data for demonstration
  const question = {
    category: "Cardiovascular",
    required: true,
    text: "During the past month, how often have you experienced chest pain or discomfort during physical activity?",
    description:
      "Please select the option that best describes your experience over the last 30 days.",
    answers: [
      {
        id: "1",
        text: "Never",
        description: "No chest pain or discomfort",
        tag: "Normal",
        color: "#10b981",
      },
      {
        id: "2",
        text: "Rarely (1-2 times)",
        description: "Very occasional episodes",
        tag: "Low",
        color: "#f59e0b",
      },
      {
        id: "3",
        text: "Sometimes (3-5 times)",
        description: "Occasional discomfort",
        tag: "Moderate",
        color: "#ef4444",
      },
      {
        id: "4",
        text: "Often (6+ times)",
        description: "Frequent discomfort",
        tag: "High",
        color: "#b91c1c",
      },
      {
        id: "5",
        text: "I prefer not to say",
        description: "",
        tag: "",
        color: "#6b7280",
      },
    ],
  };

  const isAnswerSelected = selectedAnswer !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {/* Header Section */}

        {/* Progress Bar and Question Number */}
        <View style={styles.progressContainer}>
          <Text style={styles.questionNumber}>Question 8 of 25</Text>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressText}>32%</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Tags */}
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, styles.cardioTag]}>
              <Text style={styles.tagText}>Cardiovascular</Text>
            </View>
            <View style={[styles.tag, styles.requiredTag]}>
              <Text style={styles.tagText}>Required</Text>
            </View>
          </View>

          {/* Question and Description */}
          <View style={styles.questionSection}>
            <Text style={styles.questionText}>{question.text}</Text>
            <Text style={styles.questionDescription}>
              {question.description}
            </Text>
          </View>

          {/* Answer Options */}
          <View style={styles.answersContainer}>
            {question.answers.map((answer) => (
              <TouchableOpacity
                key={answer.id}
                style={[
                  styles.answerCard,
                  selectedAnswer === answer.id && styles.selectedAnswerCard,
                ]}
                onPress={() => setSelectedAnswer(answer.id)}
              >
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedAnswer === answer.id && styles.radioOuterSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioInner,
                        selectedAnswer === answer.id && {
                          backgroundColor: answer.color,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.answerTextContainer}>
                  <Text style={styles.answerText}>{answer.text}</Text>
                  {answer.description.length > 0 && (
                    <Text style={styles.answerDescription}>
                      {answer.description}
                    </Text>
                  )}
                </View>
                {answer.tag.length > 0 && (
                  <View
                    style={[
                      styles.answerTag,
                      { backgroundColor: answer.color + "20" },
                    ]}
                  >
                    <Text
                      style={[styles.answerTagText, { color: answer.color }]}
                    >
                      {answer.tag}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Important Notice */}
          <View style={styles.importantBox}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#1976d2"
            />
            <View style={styles.importantTextContainer}>
              <Text style={styles.importantTitle}>Important</Text>
              <Text style={styles.importantText}>
                If you’re experiencing chest pain now, please seek immediate
                medical attention.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="chevron-back" size={20} color="#333" />
            <Text style={styles.footerButtonText}>Previous</Text>
          </TouchableOpacity>
          <View style={styles.pagination}>
            {Array.from({ length: 8 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index < 4 && styles.paginationDotActive,
                  index === 4 && styles.paginationDotCurrent,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !isAnswerSelected && styles.disabledButton,
            ]}
            disabled={!isAnswerSelected}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  scrollView: {
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  questionNumber: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  progressBarWrapper: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  progressBarFill: {
    width: "32%", // Based on the 32% progress in the image
    height: "100%",
    backgroundColor: "#1976d2",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "bold",
    marginLeft: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  cardioTag: {
    backgroundColor: "#fecaca",
  },
  requiredTag: {
    backgroundColor: "#fef3c7",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  questionSection: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 30,
  },
  questionDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  selectedAnswerCard: {
    borderColor: "#1976d2",
    backgroundColor: "#eff6ff",
  },
  radioContainer: {
    marginRight: 15,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#1976d2",
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  answerTextContainer: {
    flex: 1,
  },
  answerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  answerDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  answerTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  answerTagText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  importantBox: {
    flexDirection: "row",
    backgroundColor: "#eef6ff",
    padding: 15,
    borderRadius: 12,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  importantTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
  },
  importantText: {
    fontSize: 14,
    color: "#1976d2",
    marginTop: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 5,
  },
  disabledButton: {
    backgroundColor: "#a5cbe5",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#1976d2",
  },
  paginationDotCurrent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default QuestionScreen;
