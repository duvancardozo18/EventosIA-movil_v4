import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../styles/colors"

export default function HomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <View style={styles.logoOuter}></View>
          <View style={styles.logoInner}></View>
          <View style={styles.logoMiddle}></View>
          <View style={styles.logoDot}></View>
        </View>
        <Text style={styles.logoText}>ventosIA</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>Sistema de gestión</Text>
        <Text style={styles.descriptionText}>De eventos con</Text>
        <Text style={styles.descriptionText}>Planificación automática</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.primaryButtonText}>INGRESAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.secondaryButtonText}>CREAR CUENTA</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "white",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 48,
    height: 48,
    marginRight: 8,
    position: "relative",
  },
  logoOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 24,
    backgroundColor: '#4f46e5',
  },
  logoInner: {
    position: "absolute",
    width: "75%",
    height: "75%",
    borderRadius: 18,
    backgroundColor: "white",
    top: "12.5%",
    left: "12.5%",
  },
  logoMiddle: {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: 15,
    backgroundColor: '#4f46e5',
    top: "20%",
    left: "20%",
  },
  logoDot: {
    position: "absolute",
    width: "25%",
    height: "12.5%",
    borderRadius: 6,
    backgroundColor: '#4f46e5',
    top: "43.75%",
    left: "37.5%",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: '#4f46e5',
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 48,
  },
  descriptionText: {
    color: '#4f46e5',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
  },
  primaryButton: {
    width: "100%",
    padding: 12,
    backgroundColor: '#4f46e5',
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontWeight: "600",
    fontSize: 16,
  },
})

