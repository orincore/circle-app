import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import PrimaryButton from "./components/PrimaryButton";

export default function Otp() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const email = params.email as string;
  const username = params.username as string;
  const password = params.password as string;
  const firstname = params.firstname as string;
  const lastname = params.lastname as string;
  const gender = params.gender as string;
  const dateOfBirth = params.dateOfBirth as string;
  const interests = params.interests as string[];

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !username || !password || !firstname || !lastname || !gender || !dateOfBirth || !interests) {
      console.error("Missing required fields:", {
        email,
        username,
        password,
        firstname,
        lastname,
        gender,
        dateOfBirth,
        interests,
      });
      Alert.alert(
        "Missing Information",
        "Some required fields are missing. Redirecting to registration page.",
        [{ text: "OK", onPress: () => router.replace("/register") }]
      );
    }
  }, []);

  const handleSubmit = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        "https://circle-backend-1.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            username,
            password,
            firstname,
            lastname,
            gender,
            dateOfBirth,
            interests,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP verified successfully!", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        setError(result.error || "Failed to verify OTP.");
      }
    } catch (err) {
      console.error("Error Occurred:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Verify" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
