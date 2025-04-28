"use client"

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useEvent } from "../../../../contexts/EventContext"
import BottomTabBar from "../../../../components/BottomTabBar"
import { colors } from "../../../../styles/colors"
import ImageBanner from "../../../../../assets/banner_event.jpg"
import EventHeader from './detaileventsection/EventHeader';
import EventDescription from './detaileventsection/EventDescription';
import TabSection from "./detaileventsection/TabSection";
import Button from "../../../../components/Button";

export default function CompleteEventScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  console.log("Route params in CompleteEventScreen:", route);
  const event_id  = route.params || {};
  console.log("Event ID received:", event_id);

  const [activeTab, setActiveTab] = useState("Participantes");
  const [event, setEvent] = useState(null);
  const { 
    fetchEvent,
    fetchEventParticipants,
    fetchEventResources,
    fetchEventFoods,
    loading,
    error,
    currentEvent
  } = useEvent();
  const [participants, setParticipants] = useState([])
  const [resources, setResources] = useState([])
  const [foods, setFoods] = useState([])
  const [loadingResources, setLoadingResources] = useState(false)
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const { deleteEvent } = useEvent(); // asegúrate que lo tienes importado del contexto
  
  useEffect(() => {
    // Fetch event details when component mounts
    if (event_id) {
      const loadEvent = async () => {
        const eventData = await fetchEvent(event_id);
        if (eventData) {
          setEvent(eventData);
          console.log("Event data loaded:", eventData);
        } else {
          Alert.alert("Error", "No se pudo cargar la información del evento");
          navigation.goBack();
        }
      };
      
      loadEvent();
    } else {
      Alert.alert("Error", "No se recibió ID de evento");
      navigation.goBack();
    }
  }, [event_id]);

  const loadTabData = async () => {
    if (activeTab === "Participantes") {
      setLoadingParticipants(true)
      try {
        const data = await fetchEventParticipants(event_id)
        // Asegúrate de que siempre sea un array, incluso si es vacío o null/undefined
        setParticipants(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al cargar participantes:", error)
        setParticipants([]) // Asegúrate de establecer un array vacío en caso de error
      } finally {
        setLoadingParticipants(false)
      }
    } else if (activeTab === "Recursos") {
      setLoadingResources(true)
      try {
        const data = await fetchEventResources(event_id)
        setResources(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al cargar recursos:", error)
        setResources([])
      } finally {
        setLoadingResources(false)
      }
    } else if (activeTab === "Alimentos") {
      setLoadingFoods(true)
      try {
        const data = await fetchEventFoods(event_id)
        setFoods(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error al cargar alimentos:", error)
        setFoods([])
      } finally {
        setLoadingFoods(false)
      }
    }
  }

// 1. Modifica tu useEffect para el loadTabData
useEffect(() => {
  if (event_id) {
    loadTabData();
  }
}, [activeTab, event_id]); // Remove the fetch functions from dependencies

  // Use currentEvent from context if available, otherwise use local state
  const eventData = currentEvent || event;

  // Format date and time for display
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Hora no disponible";
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateRange = () => {
    if (!eventData) return "Fechas no disponibles";
    
    const startDate = formatDate(eventData.start_time);
    const endDate = formatDate(eventData.end_time);
    
    if (startDate === endDate) {
      return startDate;
    } else {
      return `${startDate} - ${endDate}`;
    }
  };


  const formatTimeRange = () => {
    if (!eventData) return "Horario no disponible";
    
    const startTime = formatTime(eventData.start_time);
    const endTime = formatTime(eventData.end_time);
    
    return `${startTime} - ${endTime}`;
  };

  const handleSaveEvent = async () => {
    // por ahora el boton no hace nada, solo muestra un mensaje
    Alert.alert("Evento guardado", "El evento ha sido guardado correctamente.");
  }

  const handleDeleteEvent = async () => {
    try {
      const confirm = await new Promise((resolve) => {
        Alert.alert(
          "Confirmar eliminación",
          "¿Estás seguro que deseas eliminar este evento?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "Eliminar", style: "destructive", onPress: () => resolve(true) }
          ]
        );
      });
  
      if (!confirm) return;
  
      const success = await deleteEvent(event_id);
  
      if (success) {
        navigation.navigate("EventDeleted");
      } else {
        Alert.alert("Error", "No se pudo eliminar el evento");
      }
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      Alert.alert("Error", "Hubo un problema eliminando el evento");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Parte superior del evento */}
        <EventHeader 
          eventData={eventData}
          formatDateRange={formatDateRange}
          formatTimeRange={formatTimeRange}
        />

        {/* Descripción del evento */}
        <EventDescription 
          description={eventData?.event_type_description} 
        />

        {/* Sección de pestañas */}
        <TabSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          participants={participants}
          resources={resources}
          foods={foods}
          loadingParticipants={loadingParticipants}
          loadingResources={loadingResources}
          loadingFoods={loadingFoods}
          event_id={event_id}
          navigation={navigation}
        />

        <Button
          title="Facturación"
          onPress={handleSaveEvent}
          backgroundColor={colors.indigo[500]}
          color="white"
          width="75%"
          height={50}
          fontSize={16}
          fontWeight="600"
          marginTop={24}
        />

        <Button
          title="Eliminar evento"
          onPress={handleDeleteEvent}
          backgroundColor={colors.red[500]}
          color="white"
          width="75%"
          height={50}
          fontSize={16}
          fontWeight="600"
          marginTop={16}
        />

      </ScrollView>

      <BottomTabBar activeTab="events" />
    </View>
  );
}

// Estilos simplificados (solo los que no están en los componentes hijos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,  // un poco de margen a los lados
    paddingBottom: 100,     // espacio libre debajo de los botones
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 20,
  }
});