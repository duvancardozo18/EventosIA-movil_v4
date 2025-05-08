import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useFood } from "../../../../../contexts/FoodContext";
import { useEvent } from "../../../../../contexts/EventContext";
import { colors } from "../../../../../styles/colors";
import CardList from '../../../../../components/CardList';
import { useCallback } from "react";
import Icon from "react-native-vector-icons/Feather";


const FoodListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Extraer event_id correctamente desde route.params
  const eventId = route.params?.event_id;

  console.log("Params received in FoodListScreen:", route.params);
  console.log("Event ID received in FoodListScreen:", eventId);

  const { deleteFood } = useFood();
  const { fetchEventFoods } = useEvent();
  const [foods, setFoods] = useState([]);  // Lista de alimentos
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Función para cargar los alimentos desde el servidor
  const loadFoods = async () => {
    if (!eventId) {
      setError("No se pudo identificar el evento. Por favor, regresa e intenta de nuevo.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const foodData = await fetchEventFoods(eventId);
      setFoods(foodData);
      setError(null); // No hay errores
    } catch (err) {
      setError("No se pudieron cargar los alimentos. Por favor, intenta de nuevo.");
      console.error("Error loading foods:", err);
    } finally {
      setLoading(false); // Fin de la carga
    }
  };

  // Cargar los alimentos cuando el componente se monta o cuando eventId cambia
  useEffect(() => {
    loadFoods();
  }, [eventId]);  // Dependencia de eventId para recargar los alimentos cuando cambia

  // Recargar los alimentos cada vez que la pantalla reciba el foco
  useFocusEffect(
    useCallback(() => {
      console.log("FoodListScreen focused - Reloading foods");
      loadFoods();
    }, [eventId])
  );

  // Recargar los alimentos después de una acción como eliminar o actualizar
  const handleAddFood = () => {
    navigation.navigate("AddFood", { eventId: eventId });
  };

  const handleEditFood = (foodId) => {
    navigation.navigate("EditFood", { eventId, foodId });
  };

  const handleDeleteFood = (foodId) => {
    console.log("Deleting food with ID:", foodId);
    Alert.alert(
      "Eliminar Alimento",
      "¿Estás seguro de que deseas eliminar este alimento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFood(foodId);
              // Ya no es necesario recargar manualmente aquí, 
              // la lista se recargará automáticamente al volver a esta pantalla
              navigation.navigate("FoodDeleted", eventId ); // Navegar a la pantalla de confirmación
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar el alimento.");
            }
          },
        },
      ]
    );
  };

  const renderFoodItem = ({ item }) => {
    const foodId = item.id_food || item.id; // Obtener ID correctamente

    return (
      <CardList
        item={{
          name: item.name,
          quantity: `${item.quantity_available || item.quantity || item.stock || 0} ${item.unit || ''}`,
          price: item.price,
          totalCost: (item.quantity_available || item.quantity || item.stock || 0) * (item.price || 0),
          description: item.description || "Sin notas adicionales"
        }}
        onEdit={() => handleEditFood(foodId)}
        onDelete={() => handleDeleteFood(foodId)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Alimentos</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
        <Feather name="plus" size={20} color={colors.white} />
        <Text style={styles.addButtonText}>Agregar Alimento</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando alimentos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={40} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFoods}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : foods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="coffee" size={60} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No hay alimentos agregados</Text>
          <Text style={styles.emptySubtext}>Agrega alimentos para tu evento</Text>
        </View>
      ) : (
        <FlatList
          data={foods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => String(item.id_food || item.id || Math.random())}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "bold",
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    maxWidth: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
});

export default FoodListScreen;