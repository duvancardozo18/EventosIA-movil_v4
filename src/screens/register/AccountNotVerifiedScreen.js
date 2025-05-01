import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Modal,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../../styles/colors"
import axios from "axios"

// Importar la variable de entorno
import { API_BASE_URL } from "@env"

const AccountNotVerifiedScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [errorFadeAnim] = useState(new Animated.Value(0))

  // Efecto para la animación del mensaje de error
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
      ]).start(() => setError(null))
    }
  }, [error, errorFadeAnim])

  // Efecto para la animación de entrada del componente
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start()
  }, [fadeAnim])

  const handleResendVerification = async () => {
    // Cerrar el teclado
    Keyboard.dismiss()
    
    // Validar el email
    if (!email || !email.includes("@")) {
      setError("Por favor, ingresa un correo electrónico válido")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Llamar al endpoint de reenvío de verificación usando API_BASE_URL
      const response = await axios.post(`${API_BASE_URL}/resend-verification-email`, {
        email: email.trim(),
      })

      // Si la solicitud es exitosa, mostrar el modal de éxito
      setShowSuccessModal(true)
      
      // Limpiar el email después de un envío exitoso
      setEmail("")
    } catch (err) {
      console.error("Error al reenviar el correo de verificación:", err)
      const errorMessage = err.response?.data?.error || "Error al reenviar el correo de verificación"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const handleGoToLogin = () => {
    setShowSuccessModal(false)
    navigation.navigate("Login")
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Feather name="mail" size={56} color={colors.indigo[500]} style={styles.icon} />
            <View style={styles.iconBadge}>
              <Feather name="alert-circle" size={24} color={colors.warning || "#f59e0b"} />
            </View>
          </View>

          <Text style={styles.title}>Verificación de cuenta</Text>

          <Text style={styles.message}>
            Ingresa tu correo electrónico para recibir un nuevo enlace de verificación y activar tu cuenta.
          </Text>

          <Animated.View 
            style={[
              styles.errorContainer, 
              { opacity: errorFadeAnim, display: error ? 'flex' : 'none' }
            ]}
          >
            <Feather name="alert-circle" size={18} color={colors.red[500]} style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Feather name="mail" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.sendButton, !email && styles.buttonDisabled]}
            onPress={handleResendVerification}
            disabled={loading || !email}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Enviar correo de verificación</Text>
                <Feather name="send" size={18} color="white" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backLink} 
            onPress={() => navigation.navigate("Login")}
          >
            <Feather name="arrow-left" size={16} color={colors.indigo[500]} style={{ marginRight: 4 }} />
            <Text style={styles.backLinkText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de éxito */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.successIconContainer}>
                <Feather name="check-circle" size={64} color={colors.green[500] || "#10b981"} />
              </View>
              
              <Text style={styles.modalTitle}>¡Correo enviado!</Text>
              
              <Text style={styles.modalText}>
                Hemos enviado un correo de verificación a tu dirección de email. 
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
              </Text>
              
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleGoToLogin}
              >
                <Text style={styles.modalButtonText}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.closeModalButton} onPress={closeSuccessModal}>
                <Text style={styles.closeModalText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100] || "#f3f4f6",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 24,
    backgroundColor: colors.indigo[50],
    padding: 16,
    borderRadius: 50,
    position: "relative",
  },
  icon: {
    backgroundColor: "transparent",
  },
  iconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 4,
    borderWidth: 2,
    borderColor: colors.gray[100] || "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gray[800] || "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.gray[600] || "#4b5563",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
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
    backgroundColor: colors.gray[50] || "#f9fafb",
    borderWidth: 1,
    borderColor: colors.gray[300] || "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 16,
    width: "100%",
    color: colors.gray[800] || "#1f2937",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  sendButton: {
    backgroundColor: colors.indigo[500] || "#6366f1",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  backLinkText: {
    color: colors.indigo[500] || "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: colors.red[50] || "#fef2f2",
    borderWidth: 1,
    borderColor: colors.red[200] || "#fecaca",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: colors.red[700] || "#b91c1c",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.gray[800] || "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    color: colors.gray[600] || "#4b5563",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: colors.indigo[500] || "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  closeModalButton: {
    paddingVertical: 8,
  },
  closeModalText: {
    color: colors.gray[500] || "#6b7280",
    fontSize: 14,
    fontWeight: "500",
  },
})

export default AccountNotVerifiedScreen