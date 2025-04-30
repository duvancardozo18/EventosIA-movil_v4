// components/EventStepsIndicator.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';

const EventStepsIndicator = ({ currentStep, totalSteps = 3 }) => {
  return (
    <View style={styles.stepsContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={`step-${index + 1}`}>
          <View style={[
            styles.step, 
            currentStep === index + 1 && styles.activeStep
          ]}>
            <Text style={styles.stepText}>{index + 1}</Text>
          </View>
          
          {index < totalSteps - 1 && (
            <View style={styles.stepLine} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray[300],
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: colors.indigo[500],
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: colors.gray[300],
  },
});

export default EventStepsIndicator;