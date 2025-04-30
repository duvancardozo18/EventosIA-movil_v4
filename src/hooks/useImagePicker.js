// hooks/useImagePicker.js
import { useState } from 'react';
import * as ImagePicker from "expo-image-picker";
import { Alert } from 'react-native';

export const useImagePicker = (onImageSelected) => {
  const [image, setImage] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permiso denegado",
        "Se necesitan permisos para acceder a la galería",
        [{ text: "OK" }]
      );
      return false;
    }
    
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImage(selectedImage);
        
        if (onImageSelected) {
          onImageSelected(selectedImage);
        }
        
        return selectedImage;
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
    
    return null;
  };

  return {
    image,
    pickImage,
  };
};

export default useImagePicker;