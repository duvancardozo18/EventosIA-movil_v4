"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useEvent } from "../contexts/EventContext"
import { colors } from "../styles/colors"

export default function SendInvitationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params
  const { registerParticipant, loading, error } = useEvent()
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
  })

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validar campos requeridos
    if (!formData.email) {
      alert("Por favor ingrese un correo electrónico")
      return
    }

    const participantData = {
      event_id: id,
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      participant_status_id: 1, // Estado "Invitado"
    }

    const success = await registerParticipant(participantData)
    if (success) {
      navigation.navigate("InvitationSent", { id })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ParticipantList", { id })}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Enviar Invitación</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Icon name="user" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Icon name="user" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.last_name}
            onChangeText={(value) => handleChange("last_name", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Icon name="mail" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? "ENVIANDO..." : "ENVIAR"}</Text>
          {!loading && <Icon name="arrow-right" size={20} color="white" style={styles.buttonIcon} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
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
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  inputIconContainer: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
})

