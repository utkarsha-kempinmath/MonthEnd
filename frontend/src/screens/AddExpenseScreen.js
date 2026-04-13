import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { addExpense } from "../services/expenseService";
import { EMOTIONS } from "../constants/emotions";
import { styles } from "../styles/addExpenseStyles";

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      return alert("Enter valid amount");
    }

    if (!category) {
      return alert("Enter category");
    }

    if (!selectedEmotion) {
      return alert("Select emotion");
    }

    const payload = {
      amount: Number(amount),
      category: category.toLowerCase().trim(),
      emotion: {
        primary: selectedEmotion,
      },
    };

    console.log("PAYLOAD:", payload);

    try {
      await addExpense(payload);
      alert("Expense added 🎉");

      setAmount("");
      setCategory("");
      setSelectedEmotion("");
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      alert("Failed to add expense");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <TextInput
        placeholder="e.g Food"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      {/* Emotion */}
      <Text style={styles.label}>How did this expense feel?</Text>

      <View style={styles.emotionContainer}>
        {EMOTIONS.map((emotion) => (
          <TouchableOpacity
            key={emotion}
            style={[
              styles.emotionChip,
              selectedEmotion === emotion && styles.selectedChip,
            ]}
            onPress={() => setSelectedEmotion(emotion)}
          >
            <Text
              style={[
                styles.emotionText,
                selectedEmotion === emotion && styles.selectedText,
              ]}
            >
              {emotion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>ADD EXPENSE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}