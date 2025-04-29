// components/FormError.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../styles/colors';

const FormError = ({ error }) => {
  if (!error) return null;
  
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: colors.red[100],
    borderWidth: 1,
    borderColor: colors.red[400],
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: colors.red[700],
  },
});

export default FormError;