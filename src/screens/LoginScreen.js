"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../contexts/AuthContext"
import { colors } from "../styles/colors"

export default function LoginScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useAuth()

  const handleLogin = async () => {
    const success = await login(email, password)
    if (success) {
      navigation.navigate("Dashboard")
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <View style={styles.logoOuter}></View>
          <View style={styles.logoInner}></View>
          <View style={styles.logoMiddle}></View>
          <View style={styles.logoDot}></View>
        </View>
        <Text style={styles.logoText}>EventosIA</Text>
      </View>

      <Text style={styles.title}>Iniciar sesión</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Icon name="mail" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Icon name="lock" size={20} color={colors.gray[400]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye-off" : "eye"} size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("RecoverPassword")}>
          <Text style={styles.forgotPasswordText}>Recuperar contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? "CARGANDO..." : "INGRESAR"}</Text>
          {!loading && <Icon name="arrow-right" size={20} color="white" style={styles.buttonIcon} />}
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          No tienes una cuenta?{" "}
          <Text style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
            Regístrate
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
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
    marginTop: 48,
  },
  logoIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
    position: "relative",
  },
  logoOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: colors.indigo[600],
  },
  logoInner: {
    position: "absolute",
    width: "75%",
    height: "75%",
    borderRadius: 15,
    backgroundColor: "white",
    top: "12.5%",
    left: "12.5%",
  },
  logoMiddle: {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: 12,
    backgroundColor: colors.indigo[600],
    top: "20%",
    left: "20%",
  },
  logoDot: {
    position: "absolute",
    width: "25%",
    height: "12.5%",
    borderRadius: 5,
    backgroundColor: colors.cyan[400],
    top: "43.75%",
    left: "37.5%",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.indigo[600],
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
    paddingRight: 12,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  registerContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  registerText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  registerLink: {
    color: colors.indigo[600],
  },
})

