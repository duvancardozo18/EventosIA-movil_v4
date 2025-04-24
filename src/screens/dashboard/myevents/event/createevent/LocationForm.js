"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "../../../../../styles/colors"
import { FormTextInput } from "../../../../../components/FormTextInput"

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
    onChange?.(updated)
  }

  useEffect(() => {
    onChange?.(locationFormData)
  }, [])

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Ubicación</Text>

      <FormTextInput
        label="Nombre del lugar"
        placeholder="Ingresa el nombre del lugar"
        value={locationFormData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <FormTextInput
        label="Descripción"
        placeholder="Describe la ubicación"
        value={locationFormData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <FormTextInput
        label="Dirección"
        placeholder="Ingresa la dirección completa"
        value={locationFormData.address}
        onChangeText={(text) => handleChange("address", text)}
      />

      <FormTextInput
        label="Precio"
        placeholder="Ingresa el precio en USD"
        value={locationFormData.price?.toString() || ""}
        onChangeText={(text) => handleChange("price", Number(text))}
        keyboardType="numeric"
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
    color: colors.gray[800],
  },
})