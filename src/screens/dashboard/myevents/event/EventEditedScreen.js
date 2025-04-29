import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import { colors } from "../../../../styles/colors"

export default function EventEditedScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { event_id } = route.params // Recibimos el ID del evento como event_id

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Operación Exitosa</Text>
        <Text style={styles.subtitle}>¡Tu evento ha sido editado correctamente!</Text>

        <View style={styles.iconContainer}>
          <Icon name="check" size={48} color="white" />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EventDetail", event_id )}>
          <Text style={styles.buttonText}>VER DETALLES DEL EVENTO</Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    paddingBottom: 28,
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
