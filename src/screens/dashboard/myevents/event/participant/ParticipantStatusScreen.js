"use client";

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../styles/colors";
import { useParticipant } from "../../../../../contexts/ParticipantContext"; // Asegúrate de tener este contexto creado

const ParticipantStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { participantId, eventId } = route.params;
  const { fetchParticipant, updateParticipant } = useParticipant(); // Asegúrate de tener estas funciones
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusMapping = {
    "Pendiente": 1,
    "Confirmado": 2,
    "Asistió": 3,
    "Cancelado": 4,
  };

  const statusOptions = [
    { id: "Pendiente", name: "Pendiente", icon: "clock", color: colors.info },  
    { id: "Confirmado", name: "Confirmado", icon: "check-circle", color: colors.success },  
    { id: "Asistió", name: "Asistió", icon: "user-check", color: colors.warning },  
    { id: "Cancelado", name: "Cancelado", icon: "x-circle", color: colors.danger },  
  ];
  

  useEffect(() => {
    loadParticipantData();
  }, [participantId]);


  

  const loadParticipantData = async () => {
    try {
      const data = await fetchParticipant(participantId);
      console.log("Datos del participante:", data);
  
      // Convertir el participant_status_id a su nombre
      const statusName = Object.keys(statusMapping).find(
        (key) => statusMapping[key] === data.participant_status_id
      );
  
      setParticipant(data);
      setSelectedStatus(statusName); // Asignar el nombre del estado
    } catch (error) {
      console.error("Error al cargar participante:", error);
      Alert.alert("Error", "No se pudo cargar la información del participante");
    } finally {
      setLoading(false);
    }
  };
  

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === participant?.status_name) return;
  
    try {
      setLoading(true);
      const newStatusId = statusMapping[selectedStatus];
      console.log("Nuevo ID de estado:", newStatusId);
  
      // Envía los datos que el backend espera:
      await updateParticipant(participantId, {
        participant_status_id: newStatusId,
        // Añade event_id si es necesario:
        // event_id: participant.event_id,
      });
  
      Alert.alert("Éxito", "Estado actualizado", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Alert.alert("Error", "No se pudo actualizar el estado del participante");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Estado del Participante</Text>
      </View>

      <View style={styles.statusContainer}>
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status.id}
            style={[
              styles.statusOption,
              selectedStatus === status.id && styles.statusOption,
            ]}
            onPress={() => setSelectedStatus(status.id)}
          >
            <Feather
              name={status.icon}
              size={24}
              color={status.color}
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
            (selectedStatus === participant?.status_name || !selectedStatus) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleStatusChange}
          disabled={selectedStatus === participant?.status_name || !selectedStatus}
        >
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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

export default ParticipantStatusScreen

