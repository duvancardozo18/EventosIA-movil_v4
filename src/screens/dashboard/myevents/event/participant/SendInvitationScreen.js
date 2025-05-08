"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { eventService } from "../../../../../services/api" 
import { colors } from "../../../../../styles/colors"
import { invitationService, userService, participantService,notificationService } from "../../../../../services/api"
import { useAuth } from '../../../../../contexts/AuthContext'

// Función para generar contraseña aleatoria
const generateRandomPassword = () => {
  const length = 10
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export default function SendInvitationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { id: eventId } = route.params
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
  })
  const { user } = useAuth()
  const { getEventById } = eventService;
  const [emailError, setEmailError] = useState("")

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

     // Validación en tiempo real del correo electrónico
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Por favor ingrese un correo electrónico válido");
      } else {
        setEmailError("");
      }
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert("Campo requerido", "Por favor ingrese su nombre")
      return
    }

    if (!formData.last_name) {
      Alert.alert("Campo requerido", "Por favor ingrese su apellido")
      return
    }

    if (!formData.email) {
      Alert.alert("Campo requerido", "Por favor ingrese un correo electrónico")
      return
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Correo inválido", "Por favor ingrese un correo electrónico válido")
      return
    }


  
    setLoading(true)
    setError("")
  
    try {
      let userId = null
  
      // 1. Primero verificar si el usuario existe por email
      const userResponse = await userService.getUser(formData.email)
      
      if (userResponse && userResponse.usuario && userResponse.usuario.id_user) {
        // Usuario existe, usar su ID
        userId = userResponse.usuario.id_user
        console.log("Usuario existente:", userResponse.usuario)
        
        // Verificar si el usuario ya está en la tabla participante para este evento
        const participantsResponse = await participantService.getEventParticipants(eventId);

        // Asegurarnos de que tenemos un array válido
        const participants = Array.isArray(participantsResponse) 
          ? participantsResponse 
          : participantsResponse?.data || [];
        
        console.log("Participantes del evento:", participants);
        
        // Buscar si el usuario actual está en la lista de participantes
        const isAlreadyParticipant = participants.some(
          participant => participant.user_id === userId
        );
        
        if (isAlreadyParticipant) {
          Alert.alert("Aviso", "Este usuario ya es participante del evento");
          return;
        }
      } else {
        console.log("Usuario no encontrado o error en petición")
        // 2. Si no existe, crear un nuevo usuario
        // Generar contraseña aleatoria
        const randomPassword = generateRandomPassword()
  
        // Crear el usuario      
        const response = await userService.createUser({
          name: formData.name,
          last_name: formData.last_name,
          email: formData.email,
          id_role: 3,
          password: randomPassword,
        })

         // Enviar las credenciales por correo
          await userService.sendCredentials({
            email: formData.email,
            password: randomPassword,
          });
        const newUser = response.data.usuario
        
        if (!newUser || !newUser.id_user) {
          throw new Error("No se pudo crear el usuario")
        }
        
        userId = newUser.id_user
      }
  
      // 3. Enviar la invitación con el ID del usuario (existente o nuevo)
      const success = await invitationService.sendInvitation({
        id_event: eventId,
        id_user: userId,
      })

      // Crear notificación de la invitación en la base de datos
        // Obtener nombre del evento
        const eventData = await eventService.getEvent(eventId)
        console.log("Datos del evento recibidos:", eventData); 
        const eventName = eventData?.data?.event_name || "un evento"
        
        const notificationPayload = {
          user_id: userId,  // Make sure this is a number, not string
          message: `Has sido invitado al evento "${eventName}"`
        };

        console.log("Notification payload:", notificationPayload);

        await notificationService.createNotification(notificationPayload);

      if (success) {
        Alert.alert("Éxito", "Invitación enviada correctamente", [
          { text: "OK", onPress: () => navigation.navigate("ParticipantList", { id: eventId }) }
        ])
      } else {
        throw new Error("No se pudo enviar la invitación")
      }
    } catch (err) {
      console.error("Error en el proceso:", err)
      setError(err.message || "Hubo un problema al procesar la solicitud")
      Alert.alert("Error", error || "Hubo un problema al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" marginTop={34} size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enviar Invitación</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="user" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nombre *"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              editable={!loading}
              maxLength={25}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="user" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Apellido *"
              value={formData.last_name}
              onChangeText={(value) => handleChange("last_name", value)}
              editable={!loading}
              maxLength={25}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Icon name="mail" size={20} color={colors.gray[400]} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico *"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                editable={!loading}
                maxLength={35}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>



          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "PROCESANDO..." : "ENVIAR INVITACIÓN"}
            </Text>
            {!loading && <Icon name="send" size={20} color="white" style={styles.buttonIcon} />}
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
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
    gap: 16,
  },
  inputContainer: {
    position: "relative",
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
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: colors.red[700],
    marginTop: 5,
    fontSize: 12,
  }
  
})