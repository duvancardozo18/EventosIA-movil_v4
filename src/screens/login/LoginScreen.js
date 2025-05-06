"use client"

import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Animated
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../../contexts/AuthContext"
import { colors } from "../../styles/colors"
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useAuth()
  
  // Estados para validación
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  // Estado para animación del error
  const [errorFadeAnim] = useState(new Animated.Value(0))
  
  // Efecto para animar el mensaje de error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.delay(5000),
        Animated.timing(errorFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [error, errorFadeAnim])
  
  // Función para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError("El correo electrónico es obligatorio")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido")
      return false
    }
    setEmailError("")
    return true
  }
  
  // Función para validar contraseña
  const validatePassword = (password) => {
    if (!password.trim()) {
      setPasswordError("La contraseña es obligatoria")
      return false
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    setPasswordError("")
    return true
  }
  
  // Validar mientras se escribe después del primer intento de envío
  useEffect(() => {
    if (formSubmitted) {
      validateEmail(email)
      validatePassword(password)
    }
  }, [email, password, formSubmitted])

  const handleLogin = async () => {
    // Cerrar el teclado
    Keyboard.dismiss()
    
    // Marcar como enviado para activar validaciones en tiempo real
    setFormSubmitted(true)
    
    // Validar campos
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    // Solo intentar login si ambos campos son válidos
    if (isEmailValid && isPasswordValid) {
      const success = await login(email.trim(), password)
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      }
    }
  }  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Animated.View style={[styles.errorContainer, { opacity: errorFadeAnim }]}>
            <Icon name="alert-circle" size={18} color={colors.red[700]} style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="mail" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onBlur={() => formSubmitted && validateEmail(email)}
            />
            {emailError ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{emailError}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="lock" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onBlur={() => formSubmitted && validatePassword(password)}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} color={colors.gray[400]} />
            </TouchableOpacity>
            {passwordError ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{passwordError}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={() => navigation.navigate("RecoverPassword")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotPasswordText}>Recuperar contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>INGRESAR</Text>
                <Icon name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            navigation.navigate('ChatBotScreen');
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </TouchableOpacity>

        <View style={styles.linksContainer}>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              No tienes una cuenta?{" "}
              <Text 
                style={styles.registerLink} 
                onPress={() => navigation.navigate("Register")}
              >
                Regístrate
              </Text>
            </Text>
          </View>
          
          <View style={styles.verificationContainer}>
            <Text style={styles.verificationText}>
              ¿No recibiste correo de verificación?{" "}
              <Text 
                style={styles.verificationLink} 
                onPress={() => navigation.navigate("AccountNotVerified")}
              >
                Solicitar
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
    
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
    flexDirection: "row",
    alignItems: "center",
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: colors.red[700],
    flex: 1,
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
    height: 48,  // Altura explícita para alinear con el input
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
    height: 48,  // Altura explícita para mejor alineación
  },
  inputError: {
    borderColor: colors.red[500],
    borderWidth: 1,
  },
  fieldErrorContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  fieldErrorText: {
    color: colors.red[600],
    fontSize: 12,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    height: 48,  // Altura explícita para alinear con el input
    justifyContent: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
    paddingVertical: 4,  // Área de toque más grande
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
    height: 48,  // Altura explícita para consistencia
  },
  // Se eliminó el estilo de botón deshabilitado
  loginButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  linksContainer: {
    marginTop: 24,
    gap: 12,
  },
  registerContainer: {
    alignItems: "center",
  },
  registerText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  registerLink: {
    color: colors.indigo[600],
  },
  verificationContainer: {
    alignItems: "center",
  },
  verificationText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  verificationLink: {
    color: colors.indigo[600],
  },
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    backgroundColor: colors.indigo[600],
    padding: 16, 
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})