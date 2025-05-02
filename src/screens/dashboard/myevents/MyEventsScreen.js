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
import { useAuth } from "../../../contexts/AuthContext";
import BottomTabBar from "../../../components/BottomTabBar";
import { colors } from "../../../styles/colors";
import { eventService } from "../../../services/api";
import moment from "moment";
import "moment/locale/es";

export default function MyEventsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Gestor"); // Estado añadido para el filtro activo

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEventByIdForUserId(user.id_user);
        setAllEvents(response.data);
        console.log("Eventos cargados:", response.data);
        setError(null);
      } catch (err) {
        setError("Error al cargar los eventos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id_user) {
      loadEvents();
    }
  }, [user]);

  const formatDate = (dateString) => {
    moment.locale("es");
    const date = moment(dateString);
    return `${date.format("D")} ${date.format("MMM").toUpperCase()} - ${date.format("ddd").toUpperCase()} - ${date.utc().format("H:mm")}`;
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => navigation.navigate("EventDetail", { event_id: item.id_event })}
    >
      <View style={styles.eventImageContainer}>
        {item.image_url && Array.isArray(item.image_url) && item.image_url.length > 0 ? (
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
        <View style={styles.dateTag}>
          <Text style={styles.eventStateText}>
            {item.state ? item.state : "Estado no disponible"}
          </Text>
        </View>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventDate}>{formatDate(item.start_time)}</Text>
        <Text style={styles.eventTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Filtrado corregido para usar user_role del evento
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = event.user_role?.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis eventos</Text>
      </View>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

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
          {["Gestor", "participante", "cliente"].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterButton,
                activeFilter === role && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(role)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === role && styles.activeFilterButtonText,
                ]}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Más recientes</Text>

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron eventos</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
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
    maxHeight: 70,
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
