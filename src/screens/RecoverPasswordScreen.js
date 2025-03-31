"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../contexts/AuthContext"
import { colors } from "../styles/colors"

export default function RecoverPasswordScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { requestPasswordReset, loading, error } = useAuth()

  const handleSubmit = async () => {
    const success = await requestPasswordReset(email)
    if (success) {
      setSubmitted(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.description}>
        Ingrese su dirección de correo electrónico para solicitar un restablecimiento de contraseña
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {submitted ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Se ha enviado un enlace de recuperación a su correo electrónico.</Text>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="mail" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="abc@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? "ENVIANDO..." : "ENVIAR"}</Text>
            {!loading && <Icon name="arrow-right" size={20} color="white" style={styles.buttonIcon} />}
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 8,
  },
  description: {
    color: colors.gray[600],
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
  successContainer: {
    backgroundColor: colors.green[200],
    borderWidth: 1,
    borderColor: colors.green[400],
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  successText: {
    color: colors.green[700],
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 24,
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

