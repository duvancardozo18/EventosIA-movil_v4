"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../../../../styles/colors"
import { useEvent } from "../../../../contexts/EventContext"

const EventStatusScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params
  const { fetchEvent, updateEventStatus } = useEvent()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(null)

  // Mapeo de los estados a sus respectivos IDs en la base de datos
  const statusMapping = {
    "Planeado": 1,
    "En curso": 2,
    "Completado": 3,
    "Cancelado": 4,
    "Confirmado": 5
  }

  const statusOptions = [
    { id: "Planeado", name: "Planeado", icon: "edit-3", color: colors.info },
    { id: "En curso", name: "En Curso", icon: "play-circle", color: colors.warning },
    { id: "Completado", name: "Completado", icon: "check-square", color: colors.success },
    { id: "Cancelado", name: "Cancelado", icon: "x-circle", color: colors.danger },
    { id: "Confirmado", name: "Confirmado", icon: "check-circle", color: colors.success },

  ]

  useEffect(() => {
    loadEventData()
  }, [eventId])

  const loadEventData = async () => {
    try {
      console.log("Cargando evento con ID:", eventId); // 👈 Agrega este log
      const eventData = await fetchEvent(eventId);
      console.log("Datos del evento:", eventData); // 👈 Otro log
      setEvent(eventData);
      setSelectedStatus(eventData.state);
    } catch (error) {
      console.error("Error al cargar el evento:", error); // 👈 Imprime el error real
      Alert.alert("Error", "No se pudo cargar la información del evento");
    } finally {
      setLoading(false);
    }
  };
  

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === event?.state) {
      return;
    }
  
    try {
      setLoading(true);
      const eventStateId = statusMapping[selectedStatus];
  
      const numericEventId = Number(eventId);
      const numericStateId = Number(eventStateId);
  
      console.log("Sending:", {
        eventId: numericEventId,
        eventStateId: numericStateId
      });
  
      await updateEventStatus(numericEventId, numericStateId);
      console.log("Redirigiendo con Event ID:", numericEventId);
      Alert.alert("Éxito", "Estado del evento actualizado correctamente", [
        { text: "OK", onPress: () => navigation.navigate("EventDetail", { event_id: numericEventId }) },
      ]);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Alert.alert("Error", "No se pudo actualizar el estado del evento");
    } finally {
      setLoading(false);
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Estado del evento</Text>
      </View>

    
      <View style={styles.statusContainer}>
        {statusOptions.map((status) => (
          <TouchableOpacity
              key={status.id}
              style={[
                styles.statusOption,
                selectedStatus === status.id && styles.selectedStatus,
              ]}
              onPress={() => setSelectedStatus(status.id)}
            >
              <Feather
                name={status.icon}
                size={24}
                color={selectedStatus === status.id ? colors.white : status.color}
              />
              <Text
                style={[
                  styles.statusText,
                  selectedStatus === status.id && { color: colors.white },
                ]}
              >
                {status.name}
              </Text>
              {selectedStatus === status.id && (
                <View style={styles.checkmark}>
                  <Feather name="check" size={16} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>

        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (selectedStatus === event?.status || !selectedStatus) && styles.saveButtonDisabled,
          ]}
          onPress={handleStatusChange}
          disabled={selectedStatus === event?.status || !selectedStatus}
        >
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginTop: 36,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  eventInfo: {
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statusContainer: {
    marginHorizontal: 16,
    marginTop: 146,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedStatus: {
    borderColor: colors.indigo[200], 
    backgroundColor: colors.indigo[200]
  },
  statusText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EventStatusScreen

