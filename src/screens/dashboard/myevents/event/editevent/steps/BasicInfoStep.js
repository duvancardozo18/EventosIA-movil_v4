// components/steps/BasicInfoStep.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import { colors } from '../../../../../../styles/colors';
import { useEventForm } from '../EventFormProvider';
import { useImagePicker} from '../../../../../../hooks/useImagePicker'

const BasicInfoStep = () => {
  const { formData, handleChange, imagePreview, updateImagePreview } = useEventForm();
  
  const { pickImage } = useImagePicker((selectedImage) => {
    handleChange("image", selectedImage);
    updateImagePreview(selectedImage.uri);
  });

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre del evento *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          placeholder="Nombre del evento"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          placeholder="Descripción del evento"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagen</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {formData.image ? formData.image.fileName || "Imagen seleccionada" : "Seleccionar imagen"}
          </Text>
          <Icon name="upload" size={20} color={colors.gray[500]} />
        </TouchableOpacity>
        {imagePreview && <Image source={{ uri: imagePreview }} style={styles.imagePreview} />}
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
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imagePickerText: {
    color: colors.gray[500],
  },
  imagePreview: {
    width: "100%",
    height: 128,
    borderRadius: 6,
    marginTop: 8,
  },
});

export default BasicInfoStep;