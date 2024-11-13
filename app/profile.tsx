import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { clearAuthData, getAuthData } from "./utils/auth";

export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy posts
  const dummyPosts = [
    { id: 1, image: "https://via.placeholder.com/150" },
    { id: 2, image: "https://via.placeholder.com/150" },
    { id: 3, image: "https://via.placeholder.com/150" },
    { id: 4, image: "https://via.placeholder.com/150" },
    { id: 5, image: "https://via.placeholder.com/150" },
    { id: 6, image: "https://via.placeholder.com/150" },
  ];

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { token } = await getAuthData();

        if (!token) {
          Alert.alert("Session Expired", "Please log in again.", [
            { text: "OK", onPress: () => router.replace("/login") },
          ]);
          return;
        }

        const response = await fetch(
          "https://circle-backend-1.onrender.com/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Unable to fetch profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await clearAuthData();
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred while logging out. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text>Error loading profile. Please try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <SafeAreaView style={styles.header}>
        <Image
          source={{ uri: profileData.profilePicture || "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <SafeAreaView style={styles.statsContainer}>
          <SafeAreaView style={styles.stat}>
            <Text style={styles.statValue}>{profileData.postsCount || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.stat}>
            <Text style={styles.statValue}>{profileData.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.stat}>
            <Text style={styles.statValue}>{profileData.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>

      {/* Profile Info */}
      <SafeAreaView style={styles.profileInfo}>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.bio}>
          {profileData.bio || "This is a dummy bio for now."}
        </Text>
      </SafeAreaView>

      {/* Dummy Posts Section */}
      <Text style={styles.sectionTitle}>Posts</Text>
      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <SafeAreaView style={styles.gridItem}>
            <Image source={{ uri: item.image }} style={styles.gridImage} />
          </SafeAreaView>
        )}
      />

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  profileInfo: {
    padding: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 16,
  },
  gridItem: {
    flex: 1,
    margin: 2,
  },
  gridImage: {
    width: "100%",
    height: 100,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
