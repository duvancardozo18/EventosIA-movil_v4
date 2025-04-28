import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../../styles/colors";

const FoodCreatedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {eventId} = route.params;

  console.log("Event ID received:", eventId);

  const handleViewFoods = () => {
    // Crear un objeto de evento con la estructura esperada por FoodListScreen
    const eventParam = {
      event_id: eventId
    };
    navigation.navigate("FoodList", eventParam); // Navegar a la lista de comidas
  };

  const handleAddAnother = () => {
    // navigation.navigate("AddFood", eventId); // Navegar a la pantalla para agregar otra comida
    console.log("Navigating to AddFood with ID:", eventId);
  };

  const handleBackToEvent = () => {
    // navigation.navigate("EventDetail", eventId); // Navegar de vuelta al evento
    console.log("Navigating back to EventDetail with ID:", eventId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>¡Comida Agregada!</Text> {/* Cambié el título de recurso a comida */}
        
        <Text style={styles.message}>La comida ha sido agregada exitosamente al evento.</Text> {/* Mensaje adaptado a comida */}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleViewFoods}>
            <Text style={styles.primaryButtonText}>Ver Comidas</Text> {/* Botón para ver las comidas */}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleAddAnother}>
            <Text style={styles.secondaryButtonText}>Agregar Otra Comida</Text> {/* Botón para agregar otra comida */}
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