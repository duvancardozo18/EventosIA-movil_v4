"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { colors } from "../../../../../styles/colors"
import { invitationService, userService, billingService,notificationService, eventService } from "../../../../../services/api"
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
  const { eventId: eventId } = route.params
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
  })
  const { user } = useAuth()
  const { getEventById } = eventService;

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async () => {
    if (!formData.email) {
      return Alert.alert("Error", "Por favor ingrese un correo electrónico");
    }
  
    if (!validateEmail(formData.email)) {
      return Alert.alert("Error", "Por favor ingrese un correo electrónico válido");
    }
  
    setLoading(true);
    setError("");
  
    try {
      let userId = null;
  
      // Verificar si el usuario existe
      const userResponse = await userService.getUser(formData.email);
      const existingUser = userResponse?.usuario;
  
      if (existingUser?.id_user) {
        userId = existingUser.id_user;
        console.log("Usuario existente:", existingUser);
      } else {
        // Crear nuevo usuario con contraseña aleatoria
        const randomPassword = generateRandomPassword();
        const createUserResponse = await userService.createUser({
          name: formData.name,
          last_name: formData.last_name,
          email: formData.email,
          id_role: 3,
          password: randomPassword,
        });
  
        const newUser = createUserResponse?.data?.usuario;
  
        if (!newUser?.id_user) throw new Error("No se pudo crear el usuario");
        userId = newUser.id_user;
  
        // Enviar credenciales por correo
        await userService.sendCredentials({
          email: formData.email,
          password: randomPassword,
        });
      }
  
      // Obtener precio del evento
      const eventPriceResponse = await eventService.getPrice(eventId);
      const price = Number(eventPriceResponse?.data?.total_value);
  
      // Crear facturación
      const billingResponse = await billingService.createBilling({
        user_id: userId,
        event_id: eventId,
        price,
      });
  
      if (!billingResponse) throw new Error("No se pudo generar la cotización");
  
      // Obtener nombre del evento
      const eventData = await eventService.getEvent(eventId);
      const eventName = eventData?.data?.event_name || "un evento";
  
      // Crear notificación
      const notificationPayload = {
        user_id: userId,
        message: `Cotización enviada para el evento: "${eventName}"`,
      };
      await notificationService.createNotification(notificationPayload);
  
      Alert.alert("Éxito", "Cotización enviada correctamente", [
        { text: "OK", onPress: () => navigation.navigate("Billing", { id: eventId }) },
      ]);
    } catch (err) {
      console.error("Error en el proceso:", err);
      const errorMessage = err.message || "Hubo un problema al procesar la solicitud";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" marginTop={34} size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enlazar Clinte</Text>

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
              placeholder="Nombre"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="user" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={formData.last_name}
              onChangeText={(value) => handleChange("last_name", value)}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="mail" size={20} color={colors.gray[400]} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "PROCESANDO..." : "ENVIAR COTIZACION"}
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
})