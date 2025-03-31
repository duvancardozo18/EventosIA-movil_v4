"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useEvent } from "../contexts/EventContext"
import { useAuth } from "../contexts/AuthContext"
import BottomTabBar from "../components/BottomTabBar"
import { colors } from "../styles/colors"

export default function MyEventsScreen() {
  const navigation = useNavigation()
  const [activeFilter, setActiveFilter] = useState("Gestor")
  const [searchTerm, setSearchTerm] = useState("")
  const { fetchEvents, events, loading, error } = useEvent()
  const { user } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Filtrar eventos según el tipo seleccionado y el término de búsqueda
  const filteredEvents = () => {
    let filtered = [...events]

    // Filtrar por rol
    if (activeFilter === "Gestor") {
      filtered = filtered.filter((event) => event.user_id_created_by === user?.id)
    } else if (activeFilter === "Participante") {
      // Aquí se podría implementar la lógica para filtrar eventos donde el usuario es participante
      // Por ahora, mostramos un subconjunto de eventos como ejemplo
      filtered = filtered.slice(0, Math.ceil(filtered.length / 2))
    } else if (activeFilter === "Cliente") {
      // Aquí se podría implementar la lógica para filtrar eventos donde el usuario es cliente
      // Por ahora, mostramos un subconjunto más pequeño de eventos como ejemplo
      filtered = filtered.slice(0, Math.ceil(filtered.length / 3))
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) => event.name?.toLowerCase().includes(term) || event.description?.toLowerCase().includes(term),
      )
    }

    return filtered
  }

  const renderEventItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => navigation.navigate("EventDetail", { id: item.id })}>
      <View style={styles.eventImageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.eventImage} resizeMode="cover" />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventDescription} numberOfLines={1}>
          {item.description?.substring(0, 50) || "Sin descripción"}
          {item.description?.length > 50 ? "..." : ""}
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando eventos...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
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
          <Icon name="search" size={20} color={colors.indigo[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "Gestor" && styles.activeFilterButton]}
            onPress={() => setActiveFilter("Gestor")}
          >
            <Text style={[styles.filterButtonText, activeFilter === "Gestor" && styles.activeFilterButtonText]}>
              Gestor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "Participante" && styles.activeFilterButton]}
            onPress={() => setActiveFilter("Participante")}
          >
            <Text style={[styles.filterButtonText, activeFilter === "Participante" && styles.activeFilterButtonText]}>
              Participante
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === "Cliente" && styles.activeFilterButton]}
            onPress={() => setActiveFilter("Cliente")}
          >
            <Text style={[styles.filterButtonText, activeFilter === "Cliente" && styles.activeFilterButtonText]}>
              Cliente
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.sectionTitle}>Más recientes</Text>

        {filteredEvents().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron eventos</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents()}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.eventsList}
          />
        )}
      </View>

      <BottomTabBar activeTab="calendar" />
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
    flexDirection: "row",
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.indigo[500],
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
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
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
})

