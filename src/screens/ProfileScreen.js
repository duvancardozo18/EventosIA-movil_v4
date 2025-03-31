"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../contexts/AuthContext"
import BottomTabBar from "../components/BottomTabBar"
import { colors } from "../styles/colors"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  // Datos de ejemplo para el perfil
  const perfilData = {
    nombre: user?.name || "Usuario",
    correo: user?.email || "usuario@example.com",
    celular: "123 456 7890",
    rol: "Gestor de eventos",
    avatar: "https://via.placeholder.com/128",
  }

  const handleLogout = async () => {
    await logout()
    navigation.navigate("Login")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: perfilData.avatar }} style={styles.avatar} />
          <Text style={styles.profileName}>{perfilData.nombre}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correo electrónico</Text>
            <Text style={styles.infoValue}>{perfilData.correo}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Celular:</Text>
            <Text style={styles.infoValue}>{perfilData.celular}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>{perfilData.rol}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color={colors.indigo[500]} style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <BottomTabBar activeTab="profile" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: colors.indigo[500],
    fontWeight: "bold",
    marginBottom: 16,
    fontSize: 16,
  },
  infoItem: {
    marginBottom: 24,
  },
  infoLabel: {
    color: colors.gray[500],
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: colors.indigo[500],
    fontWeight: "600",
  },
})

