"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { useEvent } from "../../../contexts/EventContext";
import { useAuth } from "../../../contexts/AuthContext";
import BottomTabBar from "../../../components/BottomTabBar";
import { colors } from "../../../styles/colors";
import { participantService } from "../../../services/api";
import moment from "moment";
import "moment/locale/es"; // Importar el locale español de moment

export default function MyEventsScreen() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("Gestor");
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchEvents, events, loading, error } = useEvent();
  const { user } = useAuth();
  const [participantEvents, setParticipantEvents] = useState([]);
  const [isLoadingParticipantEvents, setIsLoadingParticipantEvents] =
    useState(false);
  const [hasEvents, setHasEvents] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchEvents();
      setHasEvents(fetchedEvents && fetchedEvents.length > 0);
    };

    loadEvents();
  }, []);

  // Cargar eventos donde el usuario es participante cuando se selecciona el filtro "Participante"
  useEffect(() => {
    if (activeFilter === "Participante" && user) {
      fetchParticipantEvents();
    }
  }, [activeFilter, user]);

  // Función para obtener los eventos donde el usuario es participante
  const fetchParticipantEvents = async () => {
    if (!user) return;

    setIsLoadingParticipantEvents(true);
    try {
      // Obtenemos la lista completa de participantes usando el servicio
      const response = await participantService.getParticipants();
      const allParticipants = response.data;

      // Filtramos para encontrar participaciones del usuario actual
      // Comparamos user_id del participante con id_user del usuario autenticado
      const userParticipations = allParticipants.filter(
        (participant) => participant.user_id === user.id_user
      );

      const eventsAsParticipant = userParticipations.map((participation) => ({
        id_event: participation.id_participants, // Nota: Aquí puede que necesites el ID real del evento
        name: participation.event_name,
        image_url: participation.event_image_url,
        start_time: participation.event_start_time,
        state: participation.status_name,
        event_type: `Tipo ID: ${participation.type_of_event_id}`,
      }));

      setParticipantEvents(eventsAsParticipant);
    } catch (error) {
      console.error("Error al cargar eventos como participante:", error);
    } finally {
      setIsLoadingParticipantEvents(false);
    }
  };

  // Filtrar eventos según el tipo seleccionado y el término de búsqueda
  const filteredEvents = () => {
    let filtered = [];

    // Filtrar por rol
    if (activeFilter === "Gestor") {
      // Mantener solo eventos donde el usuario es el creador
      filtered = events.filter(
        (event) => event.user_id_created_by === user?.id_user
      );
    } else if (activeFilter === "Participante") {
      filtered = participantEvents;
    } else if (activeFilter === "Cliente") {
      filtered = [];
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term)
      );
    }

    // Asegurar que no hay duplicados mediante id_event
    const uniqueEvents = {};
    filtered.forEach((event) => {
      uniqueEvents[event.id_event] = event;
    });

    return Object.values(uniqueEvents);
  };

  const formatDate = (dateString) => {
    // Configurar moment en español
    moment.locale('es');
    
    const date = moment(dateString); 
    const day = date.format("D"); 
    const month = date.format("MMM").toUpperCase(); 
    const weekday = date.format("ddd").toUpperCase();
    const time = date.utc().format("H:mm"); // Formato 24h más común en español

    return `${day} ${month} - ${weekday} - ${time}`;
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => navigation.navigate("EventDetail", { id: item.id_event })}
    >
      <View style={styles.eventImageContainer}>
        {item.image_url &&
        Array.isArray(item.image_url) &&
        item.image_url.length > 0 ? (
          <Image
            source={{ uri: item.image_url[0] }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventDate}>{formatDate(item.start_time)}</Text>
        <Text style={styles.eventTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (
    loading ||
    (activeFilter === "Participante" && isLoadingParticipantEvents)
  ) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  const displayEvents = filteredEvents();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon
            name="arrow-left"
            size={24}
            color={colors.gray[800]}
            style={{ marginTop: 25 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis eventos</Text>
      </View>

      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color={colors.indigo[500]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScrollView}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Gestor" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter("Gestor")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Gestor" && styles.activeFilterButtonText,
              ]}
            >
              Gestor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Participante" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter("Participante")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Participante" &&
                  styles.activeFilterButtonText,
              ]}
            >
              Participante
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "Cliente" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter("Cliente")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "Cliente" && styles.activeFilterButtonText,
              ]}
            >
              Cliente
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.sectionTitle}>Más recientes</Text>

        {displayEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeFilter === "Cliente"
                ? `Función de ${activeFilter} no disponible por el momento`
                : "No se encontraron eventos"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id_event.toString()}
            contentContainerStyle={styles.eventsList}
          />
        )}
      </View>

      <BottomTabBar activeTab="calendar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    height: "100%",
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
    marginTop: 25,
  },
  content: {
    flex: 1,
    padding: 16,
    width: "100%",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
  },
  filtersContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    paddingHorizontal: 25,
    paddingVertical: 6,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.gray[100],
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: colors.indigo[500],
  },
  filtersScrollView: {
    maxHeight: 70, // Controla la altura del contenedor del ScrollView
  },
  filterButtonText: {
    color: colors.gray[700],
  },
  activeFilterButtonText: {
    color: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  eventsList: {
    paddingBottom: 16,
  },
  eventItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
  },
  eventImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.indigo[100],
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: colors.indigo[500],
    fontSize: 10,
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventDate: {
    color: colors.indigo[500],
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  eventTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventDescription: {
    color: colors.gray[500],
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray[500],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
