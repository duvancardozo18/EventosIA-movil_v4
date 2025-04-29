import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../../../../../styles/colors"

const FoodDeletedScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const eventId  = route.params
  console.log("Event ID received para mensaje exito alimento borrado:", eventId)

  const handleViewFoods = () => {
    navigation.navigate("FoodList", { event_id: eventId }) // Aquí se pasa un objeto con eventId
  }

  const handleBackToEvent = () => {
    navigation.navigate("EventDetail", eventId ) // Corregido para enviar un objeto con la propiedad eventId
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>Comida Eliminada</Text>

        <Text style={styles.message}>La comida ha sido eliminada exitosamente del evento.</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleViewFoods}>
            <Text style={styles.primaryButtonText}>Ver Comidas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleBackToEvent}>
            <Text style={styles.outlineButtonText}>Volver al Evento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: "100%",
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default FoodDeletedScreen
