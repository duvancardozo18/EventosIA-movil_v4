// components/steps/LocationStep.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../../../../../styles/colors';
import { useEventForm } from '../EventFormProvider';

const LocationStep = () => {
  const { formData, handleChange } = useEventForm();

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre del lugar *</Text>
        <TextInput
          style={styles.input}
          value={formData.location_name}
          onChangeText={(value) => handleChange("location_name", value)}
          placeholder="Nombre del lugar o establecimiento"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección *</Text>
        <TextInput
          style={styles.input}
          value={formData.location_address}
          onChangeText={(value) => handleChange("location_address", value)}
          placeholder="Dirección completa"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción del lugar</Text>
        <TextInput
          style={styles.textArea}
          value={formData.location_description}
          onChangeText={(value) => handleChange("location_description", value)}
          placeholder="Descripción del lugar (características, instalaciones, etc.)"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Precio del alquiler</Text>
        <TextInput
          style={styles.input}
          value={formData.location_rental_price}
          onChangeText={(value) => handleChange("location_rental_price", value)}
          placeholder="Precio en COP"
          keyboardType="numeric"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default LocationStep;