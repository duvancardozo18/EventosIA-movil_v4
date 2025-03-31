import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../styles/colors"

const AccountNotVerifiedScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="alert-circle" size={80} color={colors.warning} />
      </View>

      <Text style={styles.title}>Cuenta no verificada</Text>

      <Text style={styles.message}>
        Tu cuenta aún no ha sido verificada. Por favor, revisa tu correo electrónico y sigue las instrucciones para
        verificar tu cuenta.
      </Text>

      <Text style={styles.submessage}>Si no has recibido el correo de verificación, puedes solicitar uno nuevo.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 24,
  },
  submessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default AccountNotVerifiedScreen

