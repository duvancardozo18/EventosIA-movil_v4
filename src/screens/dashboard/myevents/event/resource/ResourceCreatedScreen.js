import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../styles/colors";

const ResourceCreatedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;  // Obtenemos el parámetro eventId del objeto route.params

  const handleViewResources = () => {
    // Mantener el mismo nombre de parámetro en todas las navegaciones
    navigation.navigate("ResourceList", { eventId: eventId });
  };

  const handleAddAnother = () => {
    // Pasar eventId como parte de un objeto, no directamente
    navigation.navigate("AddResource", { eventId: eventId });
  };

  const handleBackToEvent = () => {
    // Pasar eventId como parte de un objeto, no directamente
    navigation.navigate("EventDetail", eventId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={colors.success} />
        </View>
        
        <Text style={styles.title}>¡Recurso Agregado!</Text>
        
        <Text style={styles.message}>El recurso ha sido agregado exitosamente al evento.</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleViewResources}>
            <Text style={styles.primaryButtonText}>Ver Recursos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleAddAnother}>
            <Text style={styles.secondaryButtonText}>Agregar Otro Recurso</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleBackToEvent}>
            <Text style={styles.outlineButtonText}>Volver al Evento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    backgroundColor: colors.secondary,
  },
  secondaryButtonText: {
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
});

export default ResourceCreatedScreen;