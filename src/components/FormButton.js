import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../styles/colors";

export const FormButton = ({ 
  title, 
  onPress, 
  loading = false, 
  variant = "primary" 
}) => {
  const buttonStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    danger: styles.dangerButton,
  };

  const textStyles = {
    primary: styles.primaryButtonText,
    secondary: styles.secondaryButtonText,
    danger: styles.dangerButtonText,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles[variant]]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={textStyles[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: colors.indigo[600],
  },
  secondaryButton: {
    backgroundColor: colors.gray[200],
  },
  dangerButton: {
    backgroundColor: colors.red[600],
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: colors.gray[800],
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});