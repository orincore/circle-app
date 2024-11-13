import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import PrimaryButton from "./components/PrimaryButton";

const interestsData = [
  {
    category: "Travel",
    subcategories: [
      "Adventure Travel",
      "Cultural Exploration",
      "Beach Vacations",
      "Mountain Hiking",
      "City Breaks",
      "Road Trips",
    ],
  },
  {
    category: "Food & Drink",
    subcategories: [
      "Cooking",
      "Baking",
      "Wine Tasting",
      "Craft Beer",
      "Foodie Adventures",
      "Vegan Cooking",
    ],
  },
  {
    category: "Fitness & Health",
    subcategories: [
      "Yoga",
      "Running",
      "Weightlifting",
      "Cycling",
      "Pilates",
      "Meditation",
    ],
  },
  {
    category: "Arts & Entertainment",
    subcategories: [
      "Photography",
      "Movies",
      "Theater",
      "Live Music",
      "Comedy",
      "Writing",
    ],
  },
  {
    category: "Sports",
    subcategories: [
      "Football",
      "Basketball",
      "Tennis",
      "Swimming",
      "Martial Arts",
      "Rock Climbing",
    ],
  },
  {
    category: "Technology & Gaming",
    subcategories: [
      "Video Games",
      "Board Games",
      "Tech Gadgets",
      "Programming",
      "Virtual Reality",
      "E-sports",
    ],
  },
  {
    category: "Lifestyle",
    subcategories: [
      "Gardening",
      "Interior Design",
      "Fashion",
      "Sustainable Living",
      "Volunteering",
      "Collecting",
    ],
  },
  {
    category: "Education & Learning",
    subcategories: [
      "Reading",
      "Online Courses",
      "Language Learning",
      "History",
      "Science",
      "Podcasts",
    ],
  },
  {
    category: "Outdoor Activities",
    subcategories: [
      "Camping",
      "Fishing",
      "Hiking",
      "Skiing",
      "Surfing",
      "Wildlife Watching",
    ],
  },
];


export default function Interests() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Capture parameters from previous pages
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest); // Deselect if already selected
      }
      if (prev.length >= 5) {
        setError("You can select up to 5 interests.");
        return prev;
      }
      setError("");
      return [...prev, interest]; // Select the interest
    });
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Log all data to debug missing fields
      console.log("Captured Data:", {
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        password: params.password,
        username: params.username,
        gender: params.gender,
        dateOfBirth: params.dateOfBirth,
        interests: selectedInterests,
      });

      const response = await fetch("https://circle-backend-1.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: params.firstname,
          lastname: params.lastname,
          email: params.email,
          password: params.password,
          username: params.username,
          gender: params.gender,
          dateOfBirth: params.dateOfBirth,
          interests: selectedInterests,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        router.push({
          pathname: "/otp",
          params:{
            email: params.email,
            password: params.password,
            username: params.username,
            firstname: params.firstname,
            lastname: params.lastname,
            gender: params.gender,
            dateOfBirth: params.dateOfBirth,
            interests: selectedInterests, // Pass selected interests
          },
        });
      } else {
        setError(result.error || "Failed to send OTP.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Select Your Interests</Text>
      <Text style={styles.subtitle}>
        Pick up to 5 interests that describe you
      </Text>
      {interestsData.map((category) => (
        <View key={category.category} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          <View style={styles.subcategoriesContainer}>
            {category.subcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory}
                style={[
                  styles.interest,
                  selectedInterests.includes(subcategory) &&
                    styles.selectedInterest,
                ]}
                onPress={() => toggleInterest(subcategory)}
              >
                <Text
                  style={[
                    styles.interestText,
                    selectedInterests.includes(subcategory) &&
                      styles.selectedInterestText,
                  ]}
                >
                  {subcategory}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton
        title="Next"
        onPress={handleSubmit}
        isLoading={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subcategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interest: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    margin: 5,
  },
  selectedInterest: {
    backgroundColor: "#6B46C1",
  },
  interestText: {
    color: "#000",
  },
  selectedInterestText: {
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});
