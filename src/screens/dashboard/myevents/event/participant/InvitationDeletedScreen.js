"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../../../../../styles/colors"

const InvitationDeletedScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params || {}

  useEffect(() => {
    // Auto-navigate back to participants after a delay
    const timer = setTimeout(() => {
      handleBackToParticipants()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleBackToParticipants = () => {
    if (eventId) {
      navigation.navigate("ParticipantList", { eventId })
    } else {
      navigation.navigate("Dashboard")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="trash-2" size={80} color={colors.danger} />
      </View>

      <Text style={styles.title}>Invitación eliminada</Text>

      <Text style={styles.message}>La invitación ha sido eliminada exitosamente.</Text>

      <TouchableOpacity style={styles.button} onPress={handleBackToParticipants}>
        <Text style={styles.buttonText}>Volver a participantes</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default InvitationDeletedScreen

