"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useEvent } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import BottomTabBar from "../../components/BottomTabBar";
import { colors } from "../../styles/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { fetchEvents, fetchEventByIdForUserId, events, loading, error } = useEvent();
  const { user } = useAuth();
  const [hasEvents, setHasEvents] = useState(false);
  const scrollRef = useRef(null);

  // Recargar eventos automáticamente al enfocarse la pantalla
  useFocusEffect(
    useCallback(() => {
      // Si el rol es "SuperAdmin"
      if (user?.role === "SuperAdmin") {
        console.log("Rol SuperAdmin: recargando todos los eventos");
        fetchEvents(); 
      }
      // Si el rol es cualquier otro
      else if (user?.role !== "SuperAdmin") {
        console.log("Rol no es SuperAdmin: recargando eventos para este usuario");
        fetchEventByIdForUserId(user.id_user);
      }
    }, [user?.id_user, user?.role])
  );


  useEffect(() => {
    setHasEvents(events && events.length > 0);
  }, [events]);


  const uniqueEvents = events.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.id_event === value.id_event
    ))
  );
  

  const renderEventCard = ({ item }) => {
    if (!item || !item.id_event) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          navigation.navigate("EventDetail", { event_id: item.id_event });
        }}
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
        <View style={styles.eventCardContent}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.attendeesContainer}>
            <Ionicons name="calendar-number" size={16} style={styles.calendarStyle} />
            <Text style={styles.dateTagText}>
              {item.start_time
                ? new Date(item.start_time).toLocaleDateString()
                : "Fecha no disponible"}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome6 name="location-dot" size={16} style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location ? `${item.location}` : "Sin ubicación"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
    );
  };

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
        <Text style={styles.headerTitle}>EventosIA</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.createButtonContainer}>
          {user?.role === "User" && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                const phoneNumber = "573173453174";
                const message = "Hola, necesito comunicarme con un gestor.";
                const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                Linking.openURL(url).catch((err) => console.error("Error al abrir WhatsApp", err));
              }}
            >
              <Text style={styles.createButtonText}>COMUNICARME CON UN GESTOR</Text>
            </TouchableOpacity>
          )}

          {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateEvent")}
            >
              <Text style={styles.createButtonText}>CREAR EVENTO</Text>
            </TouchableOpacity>
          )}
        </View>


        {(!hasEvents && !loading && (!error || error === "No hay eventos registrados para este usuario.")) ? (
          <View style={styles.noEventsContainer}>
            <View style={styles.noEventsIcon}></View>
            <Text style={styles.noEventsTitle}>No hay eventos</Text>
            <Text style={styles.noEventsText}>
              Comunícate con un gestor de eventos
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis eventos</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MyEvents")}>
                <Text style={styles.seeAllText}>Ver todos &gt;</Text>
              </TouchableOpacity>
            </View>

            {events && events.length > 0 ? (
              <FlatList
                data={uniqueEvents}
                renderItem={renderEventCard}
                keyExtractor={(item) =>
                  item.id_event ? item.id_event.toString() : Math.random().toString()
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.eventsList}
                ref={scrollRef}
              />
            ) : (
              <Text style={styles.noEventsText}>No se encontraron eventos para mostrar.</Text>
            )}
          </View>
        )}
      </ScrollView>

      
      <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            navigation.navigate('ChatBotScreen');
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </TouchableOpacity>
      <BottomTabBar activeTab="home" />

    </View>
  );
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
    paddingBottom: 26,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 36,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  calendarStyle: {
    marginRight: 4
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
  eventStateText: {
    color: colors.indigo[500], // Color del texto, puedes cambiarlo por cualquier otro color de tu paleta
    fontSize: 12, // Tamaño de la fuente
    fontWeight: "bold", // Puedes elegir entre 'normal', 'bold', etc.
  },
  errorText: {
    color: colors.red[700],
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: colors.red[500],
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
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
    elevation: 2,
    backgroundColor: "white",
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
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
    color: colors.gray[500],
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
  attendeesText: {
    color: colors.indigo[500],
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDot: {

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
  noImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.indigo[100],
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: colors.indigo[500],
    fontSize: 12,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 30,
    backgroundColor: colors.indigo[600],
    padding: 16, 
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
})

