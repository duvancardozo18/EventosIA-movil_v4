"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../../../contexts/AuthContext"
import BottomTabBar from "../../../components/BottomTabBar"
import { colors } from "../../../styles/colors"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  
  const perfilData = {
    nombre: user?.name || "Sin datos",
    correo: user?.email || "Sin datos",
    last_name: user?.last_name || "Sin datos",
    role: user?.role || "Sin datos",
  }

  const handleLogout = async () => {
    await logout()
    navigation.navigate("Login")
  }

  return (
    <View style={styles.container}>
       <View style={styles.header}>
             <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>

      <View style={styles.content}>
        <View style={styles.profileHeader}>
           <View style={styles.avatar}>
                <Icon name="user" size={70} color="#B0B0B0" />
            </View>
          <Text style={styles.profileName}>{perfilData.nombre} {perfilData.last_name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correo electrónico</Text>
            <Text style={styles.infoValue}>{perfilData.correo}</Text>
          </View>


          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>{perfilData.role}</Text>
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
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: colors.gray[200],
    alignItems: "center",
    marginTop: 56,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoSection: {
    marginTop: 16,
    marginBottom: 40,
  },
  sectionTitle: {
    color: colors.indigo[500],
    fontWeight: "bold",
    marginBottom: 16,
    fontSize: 19,
  },
  infoItem: {
    marginBottom: 24,
  },
  infoLabel: {
    color: colors.gray[500],
    marginBottom: 4,
    fontSize: 19,
  },
  infoValue: {
    fontWeight: "500",
    fontSize: 16,
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

