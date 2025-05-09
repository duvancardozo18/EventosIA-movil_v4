import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../../../../../styles/colors"

const QuoteSentScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params

  const handleViewEvent = () => {
    navigation.navigate("Billing", { eventId: eventId });
  }


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>¡Cliente Enlazado!</Text>

        <Text style={styles.message}>
          La cotización ha sido enviada exitosamente al cliente. Recibirán un correo electrónico con los detalles del
          evento y la información de contacto.
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleViewEvent}>
            <Text style={styles.primaryButtonText}>Aceptar</Text>
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
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default QuoteSentScreen

