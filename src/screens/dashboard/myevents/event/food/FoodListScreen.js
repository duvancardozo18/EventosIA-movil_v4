"use client"

import { useEffect, useState, useContext } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { FoodContext } from "../../../../../contexts/FoodContext"
import { colors } from "../../../../../styles/colors"

const FoodListScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params
  const { getEventFoods, deleteFood } = useContext()

  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFoods()
  }, [eventId])

  const loadFoods = async () => {
    setLoading(true)
    try {
      const foodData = await getEventFoods(eventId)
      setFoods(foodData)
      setError(null)
    } catch (err) {
      setError("No se pudieron cargar los alimentos. Por favor, intenta de nuevo.")
      console.error("Error loading foods:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = () => {
    navigation.navigate("AddFoodScreen", { eventId })
  }

  const handleEditFood = (foodId) => {
    navigation.navigate("EditFoodScreen", { eventId, foodId })
  }

  const handleDeleteFood = (foodId) => {
    Alert.alert(
      "Eliminar Alimento",
      "¿Estás seguro de que deseas eliminar este alimento? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFood(eventId, foodId)
              // Refresh the list after deletion
              loadFoods()
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar el alimento. Inténtalo de nuevo.")
            }
          },
        },
      ],
    )
  }

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDetail}>
          Cantidad: {item.quantity} {item.unit}
        </Text>
        <Text style={styles.foodDetail}>Costo: ${item.cost}</Text>
        {item.notes && <Text style={styles.foodNotes}>{item.notes}</Text>}
      </View>

      <View style={styles.foodActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditFood(item.id)}>
          <Feather name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteFood(item.id)}>
          <Feather name="trash-2" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Alimentos del Evento</Text>
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
          <Text style={styles.emptySubtext}>Agrega alimentos para tu evento como bebidas, platillos, snacks, etc.</Text>
        </View>
      ) : (
        <FlatList
          data={foods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  foodCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  foodDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  foodNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: "italic",
  },
  foodActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
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
})

export default FoodListScreen

