import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { clearAuthData, getAuthData } from "./utils/auth";

export default function Dashboard() {
  const router = useRouter();

  const handleProfileRedirect = async () => {
    try {
      const { token } = await getAuthData();
      if (!token) {
        alert("Session expired. Please log in again.");
        router.replace("/login");
      } else {
        router.push("/profile"); // Redirect to profile page
      }
    } catch (error) {
      console.error("Error fetching auth token:", error);
      alert("An error occurred. Please log in again.");
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await clearAuthData(); // Clear auth data from storage
      alert("You have been logged out.");
      router.replace("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Dashboard</Text>
      <Text style={styles.subtitle}>This is your unique dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={handleProfileRedirect}>
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#6B46C1",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  logoutButton: {
    backgroundColor: "#EF4444", // Red for logout button
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
