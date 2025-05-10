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
import { Feather } from '@expo/vector-icons'
import { userService } from "../../services/api"
import { colors } from "../../styles/colors"
import { Modal } from "react-native"

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
  
  // Estados para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estados para la UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  
  // Estados para errores por campo
  const [errors, setErrors] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  // Animación para el error general
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
      ]).start(() => setError(null))
    }
  }, [error, errorFadeAnim])

  // Función para actualizar los datos del formulario
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Si ya se intentó enviar el formulario, validar en tiempo real
    if (formSubmitted) {
      validateField(name, value)
    }
  }
  
  // Validar un campo específico
  const validateField = (fieldName, value) => {
    let errorMessage = ""
    
    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio"
        } else if (value.trim().length < 2) {
          errorMessage = "El nombre debe tener al menos 2 caracteres"
        }
        break
        
      case "last_name":
        if (!value.trim()) {
          errorMessage = "El apellido es obligatorio"
        } else if (value.trim().length < 2) {
          errorMessage = "El apellido debe tener al menos 2 caracteres"
        }
        break
        
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          errorMessage = "El correo electrónico es obligatorio"
        } else if (!emailRegex.test(value)) {
          errorMessage = "Por favor, ingresa un correo electrónico válido"
        }
        break
        
      case "password":
        if (!value.trim()) {
          errorMessage = "La contraseña es obligatoria"
        } else if (value.length < 6) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres"
        }
        break
        
      case "confirmPassword":
        if (!value.trim()) {
          errorMessage = "Confirmar la contraseña es obligatorio"
        } else if (value !== formData.password) {
          errorMessage = "Las contraseñas no coinciden"
        }
        break
        
      default:
        break
    }
    
    // Actualizar el estado de errores
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }))
    
    return errorMessage === ""
  }
  
  // Validar todo el formulario
  const validateForm = () => {
    // Validar cada campo
    const nameValid = validateField("name", formData.name)
    const lastNameValid = validateField("last_name", formData.last_name)
    const emailValid = validateField("email", formData.email)
    const passwordValid = validateField("password", formData.password)
    const confirmPasswordValid = validateField("confirmPassword", formData.confirmPassword)
    
    // Devolver true si todos los campos son válidos
    return nameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid
  }

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    // Cerrar el teclado
    Keyboard.dismiss()
    
    // Marcar el formulario como enviado para activar validaciones en tiempo real
    setFormSubmitted(true)
    
    // Validar todos los campos
    if (!validateForm()) {
      // Si hay errores, no continuar
      return
    }

    if (!termsAccepted) {
      setError("Debes aceptar los términos y condiciones para continuar")
      return
    }


    try {
      setLoading(true)
      setError(null)
      // Limpiar error específico de email
      setErrors(prev => ({
        ...prev,
        email: ""
      }))

      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...userData } = formData

      await userService.createUser(userData)
      navigation.navigate("AccountCreated")
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Error al crear la cuenta"
      setError(errorMessage)
      
      // Si el error es de email duplicado, mostrarlo en el campo específico
      if (errorMessage.toLowerCase().includes('email ya está registrado')) {
        setErrors(prev => ({
          ...prev,
          email: "Este correo electrónico ya está registrado"
        }))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.gray[800]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Registro</Text>

        {error ? (
          <Animated.View style={[styles.errorContainer, { opacity: errorFadeAnim }]}>
            <Feather name="alert-circle" size={18} color={colors.red[700]} style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Feather name="user" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Nombre"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              onBlur={() => formSubmitted && validateField("name", formData.name)}
            />
            {errors.name ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{errors.name}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Feather name="user" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, errors.last_name ? styles.inputError : null]}
              placeholder="Apellido"
              value={formData.last_name}
              onChangeText={(value) => handleChange("last_name", value)}
              onBlur={() => formSubmitted && validateField("last_name", formData.last_name)}
            />
            {errors.last_name ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{errors.last_name}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Feather name="mail" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              onBlur={() => formSubmitted && validateField("email", formData.email)}
            />
            {errors.email ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{errors.email}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Feather name="lock" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              onBlur={() => formSubmitted && validateField("password", formData.password)}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={colors.gray[400]} />
            </TouchableOpacity>
            {errors.password ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{errors.password}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Feather name="lock" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirmar Contraseña"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              onBlur={() => formSubmitted && validateField("confirmPassword", formData.confirmPassword)}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={colors.gray[400]} />
            </TouchableOpacity>
            {errors.confirmPassword ? (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => setTermsAccepted(!termsAccepted)}
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: colors.gray[400],
                borderRadius: 4,
                backgroundColor: termsAccepted ? colors.indigo[500] : "white",
                marginRight: 8,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {termsAccepted && <Feather name="check" size={14} color="white" />}
            </TouchableOpacity>
            <Text style={{ flex: 1, fontSize: 14, color: colors.gray[600] }}>
              Acepto los{" "}
              <Text 
                style={{ color: colors.indigo[600], textDecorationLine: "underline" }}
                onPress={() => setShowTermsModal(true)}
              >
                Términos y condiciones
              </Text>
            </Text>
          </View>


          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
             <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
              <Feather name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
            </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            ¿Tienes una cuenta?{" "}
            <Text 
              style={styles.loginLink} 
              onPress={() => navigation.navigate("Login")}
            >
              Inicia sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>

      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>Términos y Condiciones de Uso</Text>
          
          <ScrollView style={modalStyles.body}>
            <Text style={modalStyles.text}>
              Al registrarte en nuestra plataforma:
              {"\n\n"}
              • Aceptas nuestros Términos y Condiciones
              {"\n"}
              • Autorizas el tratamiento de tus datos personales conforme a la Ley de Protección de Datos (Habeas Data)
              {"\n"}
              • Confirmas que has leído y comprendido nuestras políticas de privacidad
              {"\n\n"}
              Tus datos serán utilizados únicamente para los fines descritos en nuestras políticas y podrás ejercer tus derechos de acceso, rectificación y cancelación en cualquier momento.
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={() => setShowTermsModal(false)}
            style={modalStyles.closeButton}
            activeOpacity={0.7}
          >
            <Text style={modalStyles.closeButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Modal>
    </>
    
  )
}

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  body: { maxHeight: 300 },
  text: { fontSize: 14, color: colors.gray[700] },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.indigo[500],
    borderRadius: 4,
  },
  closeButtonText: { color: 'white' },
})

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
    paddingRight: 40,
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
  registerButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    height: 48,  // Altura explícita para consistencia
  },
  disabledButton: {
    opacity: 0.7,
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