import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import Icon from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../../contexts/AuthContext";
import { useEvent } from "../../../../contexts/EventContext";
import { useLocation } from "../../../../contexts/LocationContext";
import { useEventType } from "../../../../contexts/EventTypeContext";
import LocationForm from "./createevent/LocationForm";
import TypeEventForm from "./createevent/TypeEventForm";
import { colors } from "../../../../styles/colors";

export default function CreateEventScreen() {
  const { user } = useAuth(); // Obtiene el usuario actual
  const { createEvent, loading, error } = useEvent();
  const navigation = useNavigation();


  const { createLocation } = useLocation();  // Usamos el contexto para crear la ubicación
  const { createEventType } = useEventType();  // Usamos el contexto para crear el tipo de evento
  const [locationData, setLocationData] = useState(null);
  const [typeEventData, setTypeEventData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);

  // Datos iniciales para el evento
  const [eventFormData, setEventFormData] = useState({
    name: "",
    event_state_id: 1,
    image: null,
    user_id_created_by: user?.id_user || null, // Usando el ID del usuario actual
    type_of_event_id: null,  // Este campo será llenado más tarde con el ID del tipo de evento
    location_id: null,  // Este campo será llenado más tarde con el ID de la ubicación
  });

  const handleChange = (field, value) => {
    setEventFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Updated ${field}:`, value);  // Esto te ayudará a ver qué se actualiza.
  };

  // Asignamos el user_id_created_by al formData cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      setEventFormData((prevData) => ({
        ...prevData,
        user_id_created_by: user.id_user,  // Asignamos el ID del usuario al formData
      }));
    } else {
      console.log("No se ha cargado el usuario aún.");
    }
  }, [user]);  // Dependemos de la variable `user`, que cambiará cuando el usuario se cargue

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso requerido para acceder a la galería");
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
      setEventFormData((prev) => ({
        ...prev,
        image: selectedImage,
      }));
      setImagePreview(selectedImage.uri);
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
    setImagePreview(null);
    navigation.goBack(); // Regresar a la pantalla anterior
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventFormData.name || !locationData || !typeEventData ) {
        console.log("Error, faltan datos:", eventFormData);
        return;
      }
  
      // Crear ubicación usando el contexto
      const locationResponse = await createLocation(locationData);
      console.log(locationResponse);
      const locationId = locationResponse?.id_location;
  
      if (!locationId) throw new Error("No se pudo crear la ubicación");
  
      // Crear tipo de evento usando el contexto
      const typeResponse = await createEventType(typeEventData);
      console.log(typeResponse)
      const typeId = typeResponse?.id_type_of_event;
  
      if (!typeId) throw new Error("No se pudo crear el tipo de evento");
  
      // Crear el evento
      const formData = new FormData();
      formData.append("name", eventFormData.name);
      formData.append("event_state_id", eventFormData.event_state_id);
      formData.append("location_id", locationId);
      formData.append("type_of_event_id", typeId);
      formData.append("user_id_created_by", eventFormData.user_id_created_by);

      if (eventFormData.image) {
        const uriParts = eventFormData.image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];  // Extrae la extensión de la imagen (jpeg, png, etc.)
      
        formData.append("image", {
          uri: eventFormData.image.uri, // URI del archivo local
          type: `image/${fileType}`, // Tipo de archivo (image/png, image/jpeg)
          name: eventFormData.image.fileName || 'image.png',  // Usar el nombre del archivo real
        });
      }      
  
      console.log("📦 FormData enviado:", formData);
  
      // Enviar el FormData al backend
      const created = await createEvent(formData);
      if (created) {
        navigation.navigate("EventCreated");
      } else {
        Alert.alert("Error", "No se pudo crear el evento.");
      }
    } catch (err) {
      console.error("Error al crear el evento:", err);
      Alert.alert("Error", "Ocurrió un error al crear el evento.");
    }
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Crear Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del evento"
        value={eventFormData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={eventFormData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagen</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {eventFormData.image
              ? eventFormData.image.fileName || "Imagen seleccionada"
              : "Seleccionar imagen"}
          </Text>
          <Icon name="upload" size={20} color={colors.gray[500]} />
        </TouchableOpacity>

        {imagePreview && (
          <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
        )}
      </View>

      {/* Acordeones */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setShowTypeForm(!showTypeForm)}
      >
        <Text style={styles.accordionTitle}>Tipo de evento</Text>
        <Icon name={showTypeForm ? "chevron-up" : "chevron-down"} size={20} color={colors.gray[700]} />
      </TouchableOpacity>
      {showTypeForm && (
        <TypeEventForm onChange={(data) => setTypeEventData(data)} formData={typeEventData} />
      )}

      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setShowLocationForm(!showLocationForm)}
      >
        <Text style={styles.accordionTitle}>Ubicación</Text>
        <Icon name={showLocationForm ? "chevron-up" : "chevron-down"} size={20} color={colors.gray[700]} />
      </TouchableOpacity>
      {showLocationForm && (
        <LocationForm onChange={(data) => setLocationData(data)} />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleCreateEvent}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Creando evento..." : "Crear evento"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCancel}>
        <Text style={{ color: "red" }}>Cancelar</Text>
      </TouchableOpacity>

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
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: colors.indigo[500],
    padding: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  imageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 6,
    marginBottom: 12,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    backgroundColor: colors.gray[100],
    marginBottom: 8,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
  },
  submitButton: {
    backgroundColor: colors.indigo[600],
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: colors.red[600],
    marginTop: 8,
  },

  formGroup: {
    marginBottom: 16,
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
  
  
})