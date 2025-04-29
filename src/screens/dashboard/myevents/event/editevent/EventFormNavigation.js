// components/EventFormNavigation.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';
import { useEventForm } from './EventFormProvider';

const EventFormNavigation = ({ navigation, isLastStep }) => {
  const { currentStep, prevStep, nextStep, handleSubmit, loading } = useEventForm();

  return (
    <View style={styles.navigationButtons}>
      {currentStep > 1 && (
        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
          <Text style={styles.navigationButtonText}>Anterior</Text>
        </TouchableOpacity>
      )}
      
      {!isLastStep ? (
        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.navigationButtonText}>Siguiente</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={() => handleSubmit(navigation)}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "CREANDO EVENTO..." : "CREAR EVENTO"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  prevButton: {
    backgroundColor: colors.gray[300],
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    marginRight: 11,
  },
  nextButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  navigationButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EventFormNavigation;