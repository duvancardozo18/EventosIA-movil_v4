"use client"

import { useState, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { EventContext } from "../contexts/EventContext"
import { colors } from "../styles/colors"
import { Feather } from "@expo/vector-icons";

const LinkClientScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params
  const { linkClientToEvent } = useContext()

  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (name, value) => {
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!clientData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!clientData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
      newErrors.email = "Correo electrónico inválido"
    }

    if (!clientData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await linkClientToEvent(eventId, clientData)
      navigation.navigate("QuoteSentScreen", { eventId })
    } catch (error) {
      Alert.alert("Error", "No se pudo enlazar el cliente al evento. Inténtalo de nuevo.", [{ text: "OK" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Enlazar Cliente</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Información del Cliente</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Nombre completo del cliente"
            value={clientData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="correo@ejemplo.com"
            value={clientData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Número de teléfono"
            value={clientData.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Empresa (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la empresa"
            value={clientData.company}
            onChangeText={(text) => handleChange("company", text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notas adicionales sobre el cliente"
            value={clientData.notes}
            onChangeText={(text) => handleChange("notes", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Enviando..." : "Enviar Cotización"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  formContainer: {
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default LinkClientScreen

