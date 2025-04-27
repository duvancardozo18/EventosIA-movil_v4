"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useResource } from "../../../../../contexts/ResourceContext";
import { useEvent } from "../../../../../contexts/EventContext";
import { colors } from "../../../../../styles/colors"

const ResourceListScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params
  const { getResourcesByEvent, deleteEventResource } = useResource();
  const { getEventResources } = useEvent();

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResources()
  }, [eventId])

  const loadResources = async () => {
    setLoading(true)
    try {
      // Asumiendo que getEventResources devuelve los recursos asociados a un evento
      const resourceData = await getEventResources(eventId)
      setResources(resourceData)
      setError(null)
    } catch (err) {
      setError("No se pudieron cargar los recursos. Por favor, intenta de nuevo.")
      console.error("Error loading resources:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResource = () => {
    navigation.navigate("AddResourceScreen", { eventId })
  }

  const handleEditResource = (resourceId) => {
    navigation.navigate("EditResourceScreen", { eventId, resourceId })
  }

  const handleDeleteResource = (resourceId) => {
    Alert.alert(
      "Eliminar Recurso",
      "¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEventResource(eventId, resourceId)
              // Refresh the list after deletion
              loadResources()
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar el recurso. Inténtalo de nuevo.")
            }
          },
        },
      ],
    )
  }

  const renderResourceItem = ({ item }) => (
    <View style={styles.resourceCard}>
      <View style={styles.resourceInfo}>
        <Text style={styles.resourceName}>{item.name}</Text>
        <Text style={styles.resourceDetail}>Cantidad: {item.quantity}</Text>
        <Text style={styles.resourceDetail}>Valor Unitario: ${item.unitValue}</Text>
        <Text style={styles.resourceDetail}>Costo Total: ${item.quantity * item.unitValue}</Text>
        {item.description && <Text style={styles.resourceNotes}>{item.description}</Text>}
      </View>

      <View style={styles.resourceActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditResource(item.id_resource || item.id)}>
          <Feather name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteResource(item.id_resource || item.id)}>
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
        <Text style={styles.title}>Recursos del Evento</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddResource}>
        <Feather name="plus" size={20} color={colors.white} />
        <Text style={styles.addButtonText}>Agregar Recurso</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando recursos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={40} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadResources}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : resources.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="box" size={60} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No hay recursos agregados</Text>
          <Text style={styles.emptySubtext}>Agrega recursos para tu evento como equipos, decoración, etc.</Text>
        </View>
      ) : (
        <FlatList
          data={resources}
          renderItem={renderResourceItem}
          keyExtractor={(item) => (item.id_resource || item.id).toString()}
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
  resourceCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  resourceDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  resourceNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: "italic",
  },
  resourceActions: {
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

export default ResourceListScreen