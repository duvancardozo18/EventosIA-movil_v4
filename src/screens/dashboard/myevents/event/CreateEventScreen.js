
import { useState } from "react"
import {
  View, Text, TextInput, TouchableOpacity,
  Image, ScrollView, StyleSheet, Alert
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import * as ImagePicker from "expo-image-picker"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../../../contexts/AuthContext"
import { useEvent } from "../../../../contexts/EventContext"
import { locationService, eventTypeService } from "../../../../services/api"
import LocationForm from "./createevent/LocationForm"
import TypeEventForm from "./createevent/TypeEventForm"
import { colors } from "../../../../styles/colors"

export default function CreateEventScreen() {
  const { user } = useAuth()
  const { createEvent, loading, error } = useEvent()
  const navigation = useNavigation()

  const [locationData, setLocationData] = useState(null)
  const [typeEventData, setTypeEventData] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [showLocationForm, setShowLocationForm] = useState(false)
  const [showTypeForm, setShowTypeForm] = useState(false)

  const [eventFormData, setEventFormData] = useState({
    name: "",
    description: "",
    event_state_id: 1,
    image: null,
    user_id_created_by: null,
  })

  const handleChange = (field, value) => {
    setEventFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      alert("Permiso requerido para acceder a la galería")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0]
      setEventFormData((prev) => ({
        ...prev,
        image: selectedImage,
      }))
      setImagePreview(selectedImage.uri)
    }
  }

  const handleCreateEvent = async () => {
    try {
      if (!eventFormData.name || !locationData || !typeEventData || !user?.id) {
        Alert.alert("Error", "Faltan datos requeridos.")
        return
      }

      // 1️⃣ Crear ubicación
      const locationResponse = await locationService.createLocation(locationData)
      const locationId = locationResponse?.data?.id

      if (!locationId) throw new Error("No se pudo crear la ubicación")

      // 2️⃣ Crear tipo de evento
      const typeResponse = await eventTypeService.createEventType(typeEventData)
      const typeId = typeResponse?.data?.id

      if (!typeId) throw new Error("No se pudo crear el tipo de evento")

      // 3️⃣ Armar FormData para evento principal
      const formData = new FormData()
      formData.append("name", eventFormData.name)
      formData.append("description", eventFormData.description || "")
      formData.append("event_state_id", eventFormData.event_state_id)
      formData.append("location_id", locationId)
      formData.append("type_of_event_id", typeId)
      formData.append("user_id_created_by", user.id)

      if (eventFormData.image) {
        const uriParts = eventFormData.image.uri.split(".")
        const fileType = uriParts[uriParts.length - 1]
        formData.append("image", {
          uri: eventFormData.image.uri,
          name: `event.${fileType}`,
          type: `image/${fileType}`,
        })
      }

      console.log("📦 locationData:", locationData)
console.log("📦 typeEventData:", typeEventData)
console.log("📦 eventFormData:", eventFormData)

console.log("📦 FormData enviado:")
for (let [key, value] of formData.entries()) {
  if (value && typeof value === "object" && value.uri) {
    console.log(`- ${key}: [archivo]`, {
      uri: value.uri,
      name: value.name,
      type: value.type,
    })
  } else {
    console.log(`- ${key}: ${value}`)
  }
}
      const created = await createEvent(formData)
      if (created) {
        navigation.navigate("EventCreated")
      } else {
        Alert.alert("Error", "No se pudo crear el evento.")
      }

    } catch (err) {
      console.error("Error al crear el evento:", err)
      Alert.alert("Error", "Ocurrió un error al crear el evento.")
    }
  }

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
        <TypeEventForm onChange={(data) => setTypeEventData(data)} />
      )}

      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setShowLocationForm(!showLocationForm)}
      >
        <Text style={styles.accordionTitle}>Ubicación</Text>
        <Icon name={showLocationForm ? "chevron-up" : "chevron-down"} size={20} color={colors.gray[700]} />
      </TouchableOpacity>
      {showLocationForm && (
        <
        LocationForm onChange={(data) => setLocationData(data)} />
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

      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  )
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