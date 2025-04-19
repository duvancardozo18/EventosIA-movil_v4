import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { colors } from "../styles/colors";

export const FormSelectPicker = ({ 
  label, 
  placeholder, 
  selectedValue, 
  onValueChange, 
  options = [], 
  required = false 
}) => {
  return (
    <View style={styles.pickerContainer}>
      {label && (
        <Text style={styles.label}>
          {label} {required && "*"}
        </Text>
      )}
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor={colors.gray[600]}
      >
        <Picker.Item label={placeholder} value={undefined} />
        {options.map(opt => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  );
};

// Add the StyleSheet definition here
const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    color: colors.gray[800],
    backgroundColor: "#fff",
    justifyContent: "center",
  }
});