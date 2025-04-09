"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useEvent } from "../contexts/EventContext"
import { useAuth } from "../contexts/AuthContext"
import BottomTabBar from "../components/BottomTabBar"
import { colors } from "../styles/colors"

export default function DashboardScreen() {
  const navigation = useNavigation()
  const { fetchEvents, events, loading, error } = useEvent()
  const { user } = useAuth()
  const [hasEvents, setHasEvents] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchEvents()
      setHasEvents(fetchedEvents && fetchedEvents.length > 0)
    }

    loadEvents()
  }, [])

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate("EventDetail", { id: item.id })}>
      <View style={[styles.eventImageContainer, { backgroundColor: colors.pink[200] }]}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.eventImage} resizeMode="cover" />
        ) : null}
        <View style={styles.dateTag}>
          <Text style={styles.dateTagText}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.eventCardContent}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.attendeesContainer}>
          <View style={styles.avatarGroup}>
            <View style={[styles.avatar, styles.avatar1]}></View>
            <View style={[styles.avatar, styles.avatar2]}></View>
          </View>
          <Text style={styles.attendeesText}>+20 Going</Text>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.locationDot}></View>
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location_id ? `Location ${item.location_id}` : "Sin ubicación"}
          </Text>
        </View>
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
        <Text style={styles.headerTitle}>EventosIA</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateEvent")}>
            <Text style={styles.createButtonText}>CREAR EVENTO</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!hasEvents ? (
          <View style={styles.noEventsContainer}>
            <View style={styles.noEventsIcon}>{/* Aquí iría un icono de calendario o similar */}</View>
            <Text style={styles.noEventsTitle}>No hay eventos</Text>
            <Text style={styles.noEventsText}>Comunícate con un gestor de eventos</Text>
          </View>
        ) : (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis eventos</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MyEvents")}>
                <Text style={styles.seeAllText}>Ver todos &gt;</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={events}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id_event.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsList}
              ref={scrollRef}
            />
          </View>
        )}
      </ScrollView>

      <BottomTabBar activeTab="home" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: colors.indigo[600],
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: colors.indigo[500],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
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
  noEventsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 48,
  },
  noEventsIcon: {
    width: 96,
    height: 96,
    backgroundColor: colors.gray[100],
    borderRadius: 48,
    marginBottom: 24,
  },
  noEventsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noEventsText: {
    color: colors.gray[600],
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAllText: {
    color: colors.gray[500],
    fontSize: 14,
  },
  eventsList: {
    paddingRight: 16,
  },
  eventCard: {
    width: 160,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 2,
    backgroundColor: "white",
  },
  eventImageContainer: {
    height: 128,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  dateTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dateTagText: {
    color: colors.red[500],
    fontSize: 10,
    fontWeight: "bold",
  },
  eventCardContent: {
    padding: 12,
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarGroup: {
    flexDirection: "row",
    marginRight: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: colors.gray[300],
  },
  avatar1: {
    zIndex: 1,
  },
  avatar2: {
    marginLeft: -8,
  },
  attendeesText: {
    color: colors.indigo[500],
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  locationText: {
    color: colors.gray[500],
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

