import React, { useEffect, useState,useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { notificationService } from "../../../services/api";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../../../styles/colors";
import BottomTabBar from "../../../components/BottomTabBar";  

export default function UserNotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { getNotifications, markAsRead, deleteNotification } = notificationService;

  const fetchNotifications = async () => {
    if (!user?.id_user) return;
    setLoading(true);
    try {
      const res = await getNotifications(user.id_user);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, { read: true });
      fetchNotifications();
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
    }
  };

  const filteredNotifications = () => {
    if (!searchTerm) return notifications;
    return notifications.filter((notification) =>
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, item.read_status && styles.readItem]}>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.actions}>
        {!item.read_status && (
          <TouchableOpacity onPress={() => handleMarkAsRead(item.id_notification)}>
            <Icon name="check-circle" size={20} color={colors.green[500]} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDelete(item.id_notification)}>
          <Icon name="trash-2" size={20} color={colors.red[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );
  

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [user?.id_user])
  );
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.indigo[500]} />
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <View style={styles.center}>
        <Text>No tienes notificaciones.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado con la flecha */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>


     

      {/* Lista de Notificaciones */}
      <FlatList
        data={filteredNotifications()}
        keyExtractor={(item) => item.id_notification.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Menú inferior */}
      <BottomTabBar activeTab="notifications" />
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

  list: {
    padding: 16,
  },
  item: {
    backgroundColor: colors.gray[100], // No leída
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  readItem: {
    backgroundColor: colors.gray[300], // Leída
  },
  
  message: {
    fontSize: 16,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
