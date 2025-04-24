import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Platform 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../styles/colors";

export const FormImagePicker = ({ 
  label, 
  imageUri, 
  fileName, 
  onPress, 
  onRemove 
}) => {
  return (
    <View style={styles.formGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.imagePickerText}>
          {fileName || imageUri ? "Imagen seleccionada" : "Seleccionar imagen"}
        </Text>
        <Icon name="upload" size={20} color={colors.gray[500]} />
      </TouchableOpacity>
      
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Icon name="x" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 8,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.gray[50],
  },
  imagePickerText: {
    color: colors.gray[600],
    fontSize: 15,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 8,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 6,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(220, 53, 69, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
        shadowColor: '#000',
      },
    }),
    borderWidth: 2,
    borderColor: colors.white,
  },
});