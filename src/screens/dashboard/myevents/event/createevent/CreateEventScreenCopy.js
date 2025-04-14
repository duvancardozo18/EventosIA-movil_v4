"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import * as ImagePicker from "expo-image-picker"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useEvent } from "../../../../../contexts/EventContext"
import { useLocation } from "../../../../../contexts/LocationContext"
import { useAuth } from "../../../../../contexts/AuthContext"
import { eventTypeService } from "../../../../../services/api"
import { colors } from "../../../../../styles/colors"

export default function CreateEventScreen() {
  const navigation = useNavigation()
  const { createEvent, loading, error } = useEvent()
  const { fetchLocations, locations } = useLocation()
  const { user } = useAuth()
  const [eventTypes, setEventTypes] = useState([])
  const [eventFormData, setEventFormData] = useState({
    name: "",
    description: "",
    event_state_id: 1, // Por defecto, estado "Planificado"
    image: null,
    type_of_event_id: "",
    location_id: "",
    user_id_created_by: null,
  })

  const [typeEventData, setTypeEventData] = useState({
    event_type: "",
    description: "",
    video_conference_link: "",
    max_participants: null,
    category_id: null,
    price: null,
    start_time: new Date(),
    end_time: new Date(),
  })
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    description: "",
    price: null,
    address: ""
  })
  const [loadingEventTypes, setLoadingEventTypes] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [showStartDate, setShowStartDate] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await fetchLocations()

      setLoadingEventTypes(true)
      try {
        const response = await eventTypeService.getEventTypes()
        setEventTypes(response.data || [])
      } catch (error) {
        console.error("Error al cargar tipos de evento:", error)
      } finally {
        setLoadingEventTypes(false)
      }

      // Establecer el ID del usuario actual como creador
      if (user && user.id) {
        setFormData((prev) => ({
          ...prev,
          user_id_created_by: user.id,
        }))
      }
    }

    loadData()
  }, [fetchLocations, user])

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      alert("Se necesitan permisos para acceder a la galería")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0]
      setFormData((prev) => ({
        ...prev,
        image: selectedImage,
      }))
      setImagePreview(selectedImage.uri)
    }
  }

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!eventFormData.name || !eventFormData.user_id_created_by) {
      alert("Por favor complete los campos requeridos")
      return
    }

    const success = await createEvent(formData)
    if (success) {
      navigation.navigate("EventCreated")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear evento</Text>
      </View>

      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre del evento *</Text>
            <TextInput
              style={styles.input}
              value={eventFormData.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Nombre del evento"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.textArea}
              value={eventFormData.description}
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
                {eventFormData.image ? formData.image.fileName || "Imagen seleccionada" : "Seleccionar imagen"}
              </Text>
              <Icon name="upload" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
            {imagePreview && <Image source={{ uri: imagePreview }} style={styles.imagePreview} />}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de evento</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.type_of_event_id}
                onValueChange={(value) => handleChange("type_of_event_id", value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccionar tipo de evento" value="" />
                {loadingEventTypes ? (
                  <Picker.Item label="Cargando tipos de evento..." value="" enabled={false} />
                ) : (
                  eventTypes.map((type) => <Picker.Item key={type.id} label={type.event_type} value={type.id} />)
                )}
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ubicación</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.location_id}
                onValueChange={(value) => handleChange("location_id", value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccionar ubicación" value="" />
                {locations.map((location) => (
                  <Picker.Item key={location.id} label={location.name} value={location.id} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Enlace del meet</Text>
            <TextInput
              style={styles.input}
              value={formData.video_conference_link}
              onChangeText={(value) => handleChange("video_conference_link", value)}
              placeholder="Enlace de videoconferencia"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.sectionTitle}>Fecha y hora</Text>

            <View style={styles.dateTimeRow}>
              <Text style={styles.dateTimeLabel}>Inicio</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDate(true)}>
                <Text>{formData.start_time.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timeInput} onPress={() => setShowStartTime(true)}>
                <Text>{formData.start_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeRow}>
              <Text style={styles.dateTimeLabel}>Fin</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDate(true)}>
                <Text>{formData.end_time.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timeInput} onPress={() => setShowEndTime(true)}>
                <Text>{formData.end_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
            </View>

            {showStartDate && (
              <DateTimePicker
                value={formData.start_time}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, "startDate")}
              />
            )}
            {showStartTime && (
              <DateTimePicker
                value={formData.start_time}
                mode="time"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, "startTime")}
              />
            )}
            {showEndDate && (
              <DateTimePicker
                value={formData.end_time}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, "endDate")}
              />
            )}
            {showEndTime && (
              <DateTimePicker
                value={formData.end_time}
                mode="time"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, "endTime")}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Número máximo de participantes</Text>
            <TextInput
              style={styles.input}
              value={formData.max_participants}
              onChangeText={(value) => handleChange("max_participants", value)}
              placeholder="Número máximo de participantes"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Precio del evento</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(value) => handleChange("price", value)}
              placeholder="Precio del evento"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? "CREANDO EVENTO..." : "CREAR EVENTO"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
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
  form: {
    marginBottom: 24,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    color: colors.gray[700],
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateTimeLabel: {
    width: 50,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
  },
  dateInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})
