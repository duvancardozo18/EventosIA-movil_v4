import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { colors } from "../styles/colors"

export default function AccountCreatedScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Cuenta creada con éxito</Text>
        <Text style={styles.description}>Te enviamos un enlace de VERIFICACIÓN al correo electrónico.</Text>

        <View style={styles.iconContainer}>
          <Icon name="check" size={48} color="white" />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>ACEPTAR</Text>
        </TouchableOpacity>
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    color: colors.gray[600],
    marginBottom: 32,
    textAlign: "center",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.indigo[500],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  button: {
    width: "100%",
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})

