"use client"

import { useState, useEffect, useContext } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ResourceContext } from "../contexts/ResourceContext"
import { Feather } from "@expo/vector-icons"
import { colors } from "../styles/colors"

const EditResourceScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId, resourceId } = route.params
  const { getResourceById, updateResource } = useContext()

  const [resourceData, setResourceData] = useState({
    name: "",
    quantity: "",
    cost: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadResourceData()
  }, [resourceId])

  const loadResourceData = async () => {
    setInitialLoading(true)
    try {
      const resource = await getResourceById(eventId, resourceId)
      setResourceData({
        name: resource.name,
        quantity: resource.quantity.toString(),
        cost: resource.cost.toString(),
        notes: resource.notes || "",
      })
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del recurso. Inténtalo de nuevo.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (name, value) => {
    setResourceData((prev) => ({
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

    if (!resourceData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!resourceData.quantity.trim()) {
      newErrors.quantity = "La cantidad es requerida"
    } else if (isNaN(Number(resourceData.quantity)) || Number(resourceData.quantity) <= 0) {
      newErrors.quantity = "Debe ser un número mayor a 0"
    }

    if (!resourceData.cost.trim()) {
      newErrors.cost = "El costo es requerido"
    } else if (isNaN(Number(resourceData.cost)) || Number(resourceData.cost) < 0) {
      newErrors.cost = "Debe ser un número válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Format data for API
      const formattedData = {
        ...resourceData,
        quantity: Number(resourceData.quantity),
        cost: Number(resourceData.cost),
      }

      await updateResource(eventId, resourceId, formattedData)
      navigation.navigate("ResourceListScreen", { eventId })
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el recurso. Inténtalo de nuevo.", [{ text: "OK" }])
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando información del recurso...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Recurso</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Recurso</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Ej: Proyector, Micrófono, etc."
            value={resourceData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            placeholder="Ej: 1, 2, 3, etc."
            value={resourceData.quantity}
            onChangeText={(text) => handleChange("quantity", text)}
            keyboardType="numeric"
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Costo (MXN)</Text>
          <TextInput
            style={[styles.input, errors.cost && styles.inputError]}
            placeholder="Ej: 500"
            value={resourceData.cost}
            onChangeText={(text) => handleChange("cost", text)}
            keyboardType="numeric"
          />
          {errors.cost && <Text style={styles.errorText}>{errors.cost}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles adicionales sobre el recurso"
            value={resourceData.notes}
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
          <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar Cambios"}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
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

export default EditResourceScreen

