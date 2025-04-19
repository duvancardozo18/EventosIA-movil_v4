import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

export const FormTextInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = "default", 
  required = false 
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && (
        <Text style={styles.label}>
          {label} {required && "*"}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value?.toString() || ""}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

// Add the StyleSheet definition here
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  }
});