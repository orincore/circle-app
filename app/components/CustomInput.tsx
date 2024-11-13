import React from "react";
import { StyleSheet, TextInput, View, Text, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  value: string;
  onChangeText?: (text: string) => void; // Made optional
  placeholder: string;
  error?: string;
}

export default function CustomInput({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  ...rest
}: CustomInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText} // Safe to pass even if undefined
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize="none"
        {...rest} // Spread remaining props
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    marginTop: 4,
    fontSize: 12,
  },
});
