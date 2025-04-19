import { useState, useEffect } from "react";
import * as FileSystem from 'expo-file-system';
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEvent } from "../../../../contexts/EventContext";
import { useLocation } from "../../../../contexts/LocationContext";
import { useEventType } from "../../../../contexts/EventTypeContext";
import LocationForm from "./createevent/LocationForm";
import TypeEventForm from "./createevent/TypeEventForm";
import { FormTextInput } from "../../../../components/FormTextInput";
import { FormAccordion } from "../../../../components/FormAccordion";
import { FormButton } from "../../../../components/FormButton";
import { FormImagePicker } from "../../../../components/FormImagePicker";
import { colors } from "../../../../styles/colors";


export default function CreateEventScreen() {
  const { user } = useAuth();
  const { createEvent, loading, error } = useEvent();
  const navigation = useNavigation();
  const { createLocation } = useLocation();
  const { createEventType } = useEventType();

  const [locationData, setLocationData] = useState(null);
  const [typeEventData, setTypeEventData] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);

  const [eventFormData, setEventFormData] = useState({
    name: "",
    event_state_id: 1,
    image: null,
    user_id_created_by: user?.id_user || null,
    type_of_event_id: null,
    location_id: null,
  });

  const handleChange = (field, value) => {
    setEventFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (user) {
      setEventFormData(prev => ({ ...prev, user_id_created_by: user.id_user }));
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitas permitir el acceso a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setEventFormData(prev => ({ ...prev, image: selectedImage }));
    }
  };

  const handleCancel = () => {
    setEventFormData({
      name: "",
      event_state_id: 1,
      image: null,
      user_id_created_by: user?.id_user || null,
      type_of_event_id: null,
      location_id: null,
    });
    setLocationData(null);
    setTypeEventData(null);
    navigation.goBack();
  };

  const handleCreateEvent = async () => {
    try {
      console.log("Iniciando creación de evento...");
      
      // Validaciones básicas
      if (!eventFormData.name || !locationData || !typeEventData) {
        Alert.alert("Error", "Completa todos los campos requeridos");
        return;
      }
  
      // Crear ubicación y tipo de evento
      const locationResponse = await createLocation(locationData);
      const locationId = locationResponse?.id_location;
      if (!locationId) throw new Error("No se pudo crear la ubicación");
  
      const typeResponse = await createEventType(typeEventData);
      const typeId = typeResponse?.id_type_of_event;
      if (!typeId) throw new Error("No se pudo crear el tipo de evento");
  
      // Preparar FormData (versión compatible con React Native)
      const formData = new FormData();
      
      // Campos obligatorios
      formData.append("name", eventFormData.name);
      formData.append("event_state_id", eventFormData.event_state_id.toString());
      formData.append("location_id", locationId.toString());
      formData.append("type_of_event_id", typeId.toString());
      formData.append("user_id_created_by", eventFormData.user_id_created_by.toString());
  
      // Campo opcional (imagen)
      if (eventFormData.image?.uri) {
        const fileType = eventFormData.image.uri.split('.').pop();
        formData.append("image", {
          uri: eventFormData.image.uri,
          name: eventFormData.image.fileName || `event-img-${Date.now()}.${fileType}`,
          type: eventFormData.image.type || `image/${fileType}`
        });
      }
  
      // Debug alternativo para FormData en React Native
      console.log("Contenido del FormData:");
      console.log({
        name: formData._parts.find(p => p[0] === 'name')[1],
        location_id: formData._parts.find(p => p[0] === 'location_id')[1],
        hasImage: formData._parts.some(p => p[0] === 'image')
      });
  
      // Enviar al backend
      console.log("Enviando datos al servidor...");
      const created = await createEvent(formData);
      
      if (created) {
        console.log("Evento creado exitosamente:", created);
        navigation.navigate("EventCreated");
      } else {
        Alert.alert("Error", "No se pudo crear el evento");
      }
    } catch (err) {
      console.error("Error en creación de evento:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Crear Evento</Text>

      <FormTextInput
        label="Nombre del evento"
        placeholder="Ingresa el nombre del evento"
        value={eventFormData.name}
        onChangeText={(text) => handleChange("name", text)}
        required
      />

      <FormTextInput
        label="Descripción"
        placeholder="Describe tu evento"
        value={eventFormData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <FormImagePicker
        label="Imagen del evento"
        imageUri={eventFormData.image?.uri}
        fileName={eventFormData.image?.fileName}
        onPress={pickImage}
        onRemove={() => setEventFormData(prev => ({ ...prev, image: null }))}
      />

      <FormAccordion
        title="Tipo de evento"
        isOpen={showTypeForm}
        onToggle={() => setShowTypeForm(!showTypeForm)}
      >
        <TypeEventForm 
          onChange={(data) => setTypeEventData(data)} 
          formData={typeEventData} 
        />
      </FormAccordion>

      <FormAccordion
        title="Ubicación"
        isOpen={showLocationForm}
        onToggle={() => setShowLocationForm(!showLocationForm)}
      >
        <LocationForm onChange={(data) => setLocationData(data)} />
      </FormAccordion>

      <FormButton
        title="Crear evento"
        onPress={handleCreateEvent}
        loading={loading}
      />

      <FormButton
        title="Cancelar"
        onPress={handleCancel}
        variant="danger"
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.gray[800],
  },
  error: {
    color: colors.red[600],
    marginTop: 8,
    textAlign: "center",
  },
});