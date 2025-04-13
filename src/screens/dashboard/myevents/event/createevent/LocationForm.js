"use client"

import { useEffect, useState } from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { colors } from "../../../../../styles/colors"

export default function CreateLocationForm({ onChange }) {
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    description: "",
    price: null,
    address: "",
  })

  const handleChange = (name, value) => {
    const updated = {
      ...locationFormData,
      [name]: value,
    }
    setLocationFormData(updated)
    onChange?.(updated) // ← actualiza al componente padre
  }

  useEffect(() => {
    onChange?.(locationFormData)
  }, [])

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Ubicación</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del lugar"
        value={locationFormData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={locationFormData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={locationFormData.address}
        onChangeText={(text) => handleChange("address", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={locationFormData.price?.toString() || ""}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("price", Number(text))}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
})