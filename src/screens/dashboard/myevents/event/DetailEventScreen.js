"use client"

//import { useState, useEffect, useCallback } from "react";
//import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
//import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native"
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native"

import { useEvent } from "../../../../contexts/EventContext"
import BottomTabBar from "../../../../components/BottomTabBar"
import { colors } from "../../../../styles/colors"
import EventHeader from './detaileventsection/EventHeader';
import EventDescription from './detaileventsection/EventDescription';
import TabSection from "./detaileventsection/TabSection";
import Button from "../../../../components/Button";
import EditEventButton from "../../../../components/EditEventButton";

export default function CompleteEventScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  //const event_id  = route.params || {};
  //console.log("Event ID received:", event_id);

  const { event_id } = route.params || {};
  const numericEventId = Number(event_id);

  //console.log("Event ID received:", event_id);


  const [activeTab, setActiveTab] = useState("Participantes");
  const [event, setEvent] = useState(null);
  const { 
    fetchEvent,
    fetchEventParticipants,
    fetchEventResources,
    fetchEventFoods,
    loading,
    error,
    currentEvent,
    deleteEvent
  } = useEvent();
  const [participants, setParticipants] = useState([])
  const [resources, setResources] = useState([])
  const [foods, setFoods] = useState([])
  const [loadingResources, setLoadingResources] = useState(false)
  const [loadingFoods, setLoadingFoods] = useState(false)
  const [loadingParticipants, setLoadingParticipants] = useState(false)

  const isFocused = useIsFocused();


  // Usar useFocusEffect para recargar los datos cada vez que la pantalla obtiene el foco
  useEffect(() => {
    if (isFocused && event_id) {
      const loadEvent = async () => {
        const eventData = await fetchEvent(numericEventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          Alert.alert("Error", "No se pudo cargar la información del evento");
          navigation.goBack();
        }
      };
      loadEvent();
    }
  }, [isFocused, event_id]);

  const loadTabData = async () => {
    if (activeTab === "Participantes") {
      setLoadingParticipants(true)
      try {
        const data = await fetchEventParticipants(event_id)
        // Asegúrate de que siempre sea un array, incluso si es vacío o null/undefined
        setParticipants(Array.isArray(data) ? data : [])
      } catch (error) {
        //console.error("Error al cargar participantes:", error)
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
        //console.error("Error al cargar recursos:", error)
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
        //console.error("Error al cargar alimentos:", error)
        setFoods([])
      } finally {
        setLoadingFoods(false)
      }
    }
  }

  // Load tab data when activeTab changes
  // Solo cargar datos de pestaña cuando cambia la pestaña activa
  useEffect(() => {
    if (event_id && event) { // Solo cargar si tenemos el evento cargado
      loadTabData();
    }
  }, [activeTab, event_id, event]);

  // Ya no recargamos los datos de la pestaña al volver a la pantalla
  // Ya estamos recargando todo el evento, y los datos de la pestaña se cargan cuando cambia activeTab
  // Si reactivamos esto, puede causar ciclos infinitos de renderizado

  // Usar preferentemente el estado local, que se actualiza al enfocar la pantalla
  const eventData = event;

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

  const handleEditEvent = () => {
    // Navegar a la pantalla de edición de evento
    navigation.navigate("EditEvent", { event_id });
  };

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

  // Renderizar un indicador de carga mientras se carga el evento
  if (!eventData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Cargando detalles del evento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Parte superior del evento */}
        <EventHeader 
          eventData={eventData}
          formatDateRange={formatDateRange}
          formatTimeRange={formatTimeRange}
        />

        {/* Botón de Editar Evento - Ahora usando el componente EditButton */}
        <EditEventButton onPress={handleEditEvent} />

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

// Estilos simplificados
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