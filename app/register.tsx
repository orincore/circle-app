import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import CustomInput from "./components/CustomInput";
import PrimaryButton from "./components/PrimaryButton";

interface FormData {
  firstname: string;
  lastname: string;
  password: string;
  username: string;
  gender: string;
  dateOfBirth: string;
}

export default function Registration() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string; // Capture email passed from Login
  const [form, setForm] = useState<FormData>({
    firstname: "",
    lastname: "",
    password: "",
    username: "",
    gender: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [openGenderPicker, setOpenGenderPicker] = useState(false);
  const [genders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!form.firstname.trim()) newErrors.firstname = "First name is required";
    if (!form.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.gender.trim()) newErrors.gender = "Gender is required";
    if (!form.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: "/interests",
        params: { ...form, email }, // Include email for the next step
      });
    }, 1000);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, dateOfBirth: formattedDate }));
      if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Join Circle with {email} and connect with your friends
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <CustomInput
            value={form.firstname}
            onChangeText={(text) => setForm((prev) => ({ ...prev, firstname: text }))}
            placeholder="Enter your first name"
            error={errors.firstname}
          />
          <Text style={styles.label}>Last Name</Text>
          <CustomInput
            value={form.lastname}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, lastname: text }))
            }
            placeholder="Enter your last name"
            error={errors.lastname}
          />

          <Text style={styles.label}>Username</Text>
          <CustomInput
            value={form.username}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, username: text }))
            }
            placeholder="Choose a username"
            error={errors.username}
          />

          <Text style={styles.label}>Password</Text>
          <CustomInput
            value={form.password}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, password: text }))
            }
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
          />

          <Text style={styles.label}>Gender</Text>
          <DropDownPicker
            open={openGenderPicker}
            value={form.gender}
            items={genders}
            setOpen={setOpenGenderPicker}
            setValue={(callback) => {
              setForm((prev) => ({ ...prev, gender: callback(prev.gender) }));
              if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
            }}
            placeholder="Select your gender"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

          <Text style={styles.label}>Date of Birth</Text>
          <CustomInput
            value={form.dateOfBirth}
            placeholder="YYYY-MM-DD"
            onFocus={() => setShowDatePicker(true)}
            editable={true}
            error={errors.dateOfBirth}
          />
          {showDatePicker && (
            <DateTimePicker
              value={
                form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()
              }
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Continue"
              onPress={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { marginBottom: 32 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center" },
  form: { flex: 1 },
  label: { fontSize: 14, color: "#6B7280", marginBottom: 4, marginTop: 16 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: { borderWidth: 1, borderColor: "#ccc" },
  buttonContainer: { marginTop: 16 },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
