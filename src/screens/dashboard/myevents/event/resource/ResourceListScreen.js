import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useResource } from "../../../../../contexts/ResourceContext";
import { useEvent } from "../../../../../contexts/EventContext";
import { colors } from "../../../../../styles/colors";
import CardList from "../../../../../components/CardList";// Asegúrate de ajustar el path al componente ResourceCard

const ResourceListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;
  const { fetchEventResources, removeResourceFromEvent } = useEvent();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResources();
    const unsubscribe = navigation.addListener('focus', () => {
      loadResources();
    });
    return unsubscribe;
  }, [eventId, navigation]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const resourceData = await fetchEventResources(eventId);
      setResources(resourceData);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los recursos. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = () => {
    navigation.navigate("AddResource", { eventId });
  };

  const handleEditResource = (resourceId) => {
    navigation.navigate("EditResource", { eventId, resourceId });
  };

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
            setIsDeleting(true);
            try {
              await removeResourceFromEvent(eventId, resourceId);
              await loadResources();
              navigation.navigate("ResourceDeleted", { eventId });
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar el recurso. Inténtalo de nuevo.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const renderResourceItem = ({ item }) => (
    <CardList
      item={{
        name: item.name,
        quantity: item.quantity_available,
        price: item.price,
        totalCost: item.quantity_available * item.price,
        description: item.description || "Sin notas adicionales"
      }}
      onEdit={() => handleEditResource(item.id_resource || item.id)}
      onDelete={() => handleDeleteResource(item.id_resource || item.id)}
    />
  );  

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

      {loading || isDeleting ? (
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
  );
};

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
});

export default ResourceListScreen;
