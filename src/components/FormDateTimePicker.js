import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../styles/colors";

export const FormDateTimePicker = ({ 
  label, 
  value, 
  onChange, 
  minimumDate,
  required = false 
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [tempDateTime, setTempDateTime] = useState(value || new Date());
  
  // Ensure minimum date is today for start date (if no minimum date is provided)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  
  const effectiveMinDate = minimumDate || today;

  const formatDateTime = (date) => {
    if (!date) return '';
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateString} ${timeString}`;
  };

  const handleChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (!selectedDate) {
      setShowPicker(false);
      return;
    }

    let newDateTime = new Date(tempDateTime);
    
    if (pickerMode === 'date') {
      // Keep current time, update date
      newDateTime = new Date(selectedDate);
      newDateTime.setHours(
        tempDateTime.getHours(),
        tempDateTime.getMinutes(),
        0
      );
      
      // Update temporary state
      setTempDateTime(newDateTime);
      
      // After date selection, show time picker
      setPickerMode('time');
    } else {
      // Keep current date, update time
      newDateTime.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0
      );
      
      // Complete the selection process
      setShowPicker(false);
      setPickerMode('date'); // Reset for next time
      setTempDateTime(newDateTime);
      
      // Send final update to parent
      onChange(newDateTime);
    }
  };

  // Ensure value is in sync with component
  React.useEffect(() => {
    if (value && value instanceof Date) {
      setTempDateTime(value);
    }
  }, [value]);

  return (
    <View style={styles.dateTimeContainer}>
      {label && (
        <Text style={styles.label}>
          {label} {required && "*"}
        </Text>
      )}
      <TouchableOpacity 
        onPress={() => {
          setPickerMode('date');
          setShowPicker(true);
        }} 
        style={styles.dateButton}
      >
        <Text style={styles.dateTimeText}>
          {value instanceof Date ? formatDateTime(value) : "Seleccionar fecha y hora"}
        </Text>
        <Ionicons name="calendar-outline" size={22} color={colors.gray[400]} />
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={tempDateTime}
          mode={pickerMode}
          display="default"
          onChange={handleChange}
          minimumDate={effectiveMinDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateTimeContainer: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 4,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  dateTimeText: {
    color: colors.gray[600],
    fontSize: 16,
  },
});