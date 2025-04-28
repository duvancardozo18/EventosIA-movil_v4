import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../styles/colors";

const FoodCreatedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Extract event_id directly from route.params (simplified structure)
  const eventId = route.params?.event_id || route.params?.params?.event_id;
  
  console.log("Route params in FoodCreatedScreen:", route.params);
  console.log("Event ID extracted in FoodCreatedScreen:", eventId);

  const handleViewFoods = () => {
    // Navigate to FoodList with simplified params structure
    navigation.navigate("FoodList", { event_id: eventId });
  };

  const handleAddAnother = () => {
    // Navigate to AddFood with simplified params structure
    navigation.navigate("AddFood", { eventId });
  };

  const handleBackToEvent = () => {
    // Navigate back to EventDetail with simplified params structure
    navigation.navigate("EventDetail", eventId );
    console.log("Navigating back to EventDetail with ID:", eventId);
  };

  // Error handling if no eventId
  if (!eventId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Error: No se pudo identificar el evento</Text>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, { marginTop: 20 }]} 
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.primaryButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>¡Comida Agregada!</Text>
        
        <Text style={styles.message}>La comida ha sido agregada exitosamente al evento.</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleViewFoods}>
            <Text style={styles.primaryButtonText}>Ver Comidas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleAddAnother}>
            <Text style={styles.secondaryButtonText}>Agregar Otra Comida</Text>
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

export default FoodCreatedScreen;