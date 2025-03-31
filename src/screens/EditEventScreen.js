"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { colors } from "../styles/colors"
import { useEvent } from "../contexts/EventContext"
import { useLocation } from "../contexts/LocationContext"

const EditEventScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params
  const { getEvent, updateEvent } = useEvent()
  const { getLocations } = useLocation()

  const [event, setEvent] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  useEffect(() => {
    loadEventData()
    loadLocations()
  }, [eventId])

  const loadEventData = async () => {
    try {
      const eventData = await getEvent(eventId)
      setEvent(eventData)
      setName(eventData.name)
      setDescription(eventData.description)

      const eventDate = new Date(eventData.date)
      setDate(eventDate)
      setTime(eventDate)

      setLocation(eventData.location)
      setCapacity(eventData.capacity.toString())
      setIsPublic(eventData.isPublic)
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del evento")
    } finally {
      setLoading(false)
    }
  }

  const loadLocations = async () => {
    try {
      const locationsData = await getLocations()
      setLocations(locationsData)
    } catch (error) {
      console.error("Error loading locations:", error)
    }
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      setTime(selectedTime)
    }
  }

  const handleUpdateEvent = async () => {
    if (!name || !description || !location || !capacity) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos")
      return
    }

    // Combine date and time
    const eventDateTime = new Date(date)
    eventDateTime.setHours(time.getHours(), time.getMinutes())

    const eventData = {
      name,
      description,
      date: eventDateTime.toISOString(),
      location,
      capacity: Number.parseInt(capacity),
      isPublic,
    }

    try {
      setLoading(true)
      await updateEvent(eventId, eventData)
      Alert.alert("Éxito", "Evento actualizado correctamente", [
        { text: "OK", onPress: () => navigation.navigate("EventDetail", { eventId }) },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el evento")
      setLoading(false)
    }
  }

  if (loading && !event) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Editar evento</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del evento *</Text>
            <TextInput style={styles.input} placeholder="Nombre del evento" value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe tu evento"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha *</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                {date.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Feather name="calendar" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hora *</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateText}>
                {time.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Feather name="clock" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker value={time} mode="time" display="default" onChange={handleTimeChange} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ubicación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ubicación del evento"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Capacidad *</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de participantes"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Evento público</Text>
            <Switch
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={isPublic ? colors.primary : colors.textSecondary}
              onValueChange={setIsPublic}
              value={isPublic}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleUpdateEvent}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Actualizando..." : "Actualizar evento"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EditEventScreen

