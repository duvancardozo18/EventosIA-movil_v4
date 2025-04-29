"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from '@expo/vector-icons'
import { userService } from "../../services/api"
import { colors } from "../../styles/colors"

export default function RegisterScreen() {
  const navigation = useNavigation()
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_role: 3, // Por defecto, rol de usuario normal
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...userData } = formData

      await userService.createUser(userData)
      navigation.navigate("AccountCreated")
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Registro</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Feather name="user" size={20} color={colors.gray[400]} />
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
            <Feather  name="user" size={20} color={colors.gray[400]} />
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
            <Feather con name="mail" size={20} color={colors.gray[400]} />
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

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Feather  name="lock" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Feather  name={showPassword ? "eye-off" : "eye"} size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Feather  name="lock" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.registerButtonText}>{loading ? "PROCESANDO..." : "CREAR CUENTA"}</Text>
          {!loading && <Feather  name="arrow-right" size={20} color="white" style={styles.buttonIcon} />}
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Tienes una cuenta?{" "}
          <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
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
    paddingRight: 40,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  registerButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  loginLink: {
    color: colors.indigo[600],
  },
})

