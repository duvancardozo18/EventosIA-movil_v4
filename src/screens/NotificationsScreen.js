"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import BottomTabBar from "../components/BottomTabBar"
import { colors } from "../styles/colors"

export default function NotificationsScreen() {
  const navigation = useNavigation()
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      fecha: "Wed, Apr 28",
      hora: "5:30 PM",
      titulo: "Jo Malone London's Mother's Day Presents",
      lugar: "Radius Gallery",
      ubicacion: "Santa Cruz, CA",
      imagen: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      fecha: "Wed, Apr 28",
      hora: "5:30 PM",
      titulo: "Jo Malone London's Mother's Day Presents",
      lugar: "Radius Gallery",
      ubicacion: "Santa Cruz, CA",
      imagen: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      fecha: "Wed, Apr 28",
      hora: "5:30 PM",
      titulo: "Jo Malone London's Mother's Day Presents",
      lugar: "Radius Gallery",
      ubicacion: "Santa Cruz, CA",
      imagen: "https://via.placeholder.com/80",
    },
  ])

  const eliminarNotificacion = (id) => {
    setNotificaciones(notificaciones.filter((notif) => notif.id !== id))
  }

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationImageContainer}>
        <Image source={{ uri: item.imagen }} style={styles.notificationImage} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationDate}>
            {item.fecha} • {item.hora}
          </Text>
          <TouchableOpacity onPress={() => eliminarNotificacion(item.id)} style={styles.deleteButton}>
            <Icon name="trash-2" size={20} color={colors.indigo[500]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.notificationTitle}>{item.titulo}</Text>
        <View style={styles.locationContainer}>
          <Icon name="map-pin" size={16} color={colors.gray[500]} style={styles.locationIcon} />
          <Text style={styles.locationText}>
            {item.lugar} • {item.ubicacion}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>

      <View style={styles.content}>
        {notificaciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        ) : (
          <FlatList
            data={notificaciones}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.notificationsList}
          />
        )}
      </View>

      <BottomTabBar activeTab="notifications" />
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
  notificationsList: {
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  notificationImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.pink[100],
    overflow: "hidden",
    marginRight: 12,
  },
  notificationImage: {
    width: "100%",
    height: "100%",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationDate: {
    color: colors.indigo[500],
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: colors.gray[500],
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray[500],
  },
})

