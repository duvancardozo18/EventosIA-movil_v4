import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../../../../../styles/colors';
import AddButton from '../../../../../../components/AddButton';
import DetailsButton from '../../../../../../components/DetailsButtton';
import ResourceCard from '../../../../../../components/Card'
import { useEvent } from '../../../../../../contexts/EventContext';
import { useFocusEffect } from '@react-navigation/native';

const ResourcesTab = ({ navigation, event_id }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchEventResources } = useEvent();

  console.log("Event ID in ResourcesTab:", event_id);

  // Función para cargar los recursos
  const loadResources = async () => {
    setLoading(true);
    try {
      const resourceData = await fetchEventResources(event_id);
      console.log("Fetched Resources:", resourceData);
      setResources(resourceData);
      console.log("Updated Resources State:", resourceData);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los recursos. Por favor, intenta de nuevo.");
      console.error("Error loading resources:", err);
    } finally {
      setLoading(false);
    }
  };  

  // Cargar recursos cuando el componente se monta inicialmente
  useEffect(() => {
    loadResources();
  }, [event_id]);

  // Recargar recursos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    React.useCallback(() => {
      console.log("ResourcesTab recibió el foco - recargando recursos...");
      loadResources();
      return () => {
        // Cleanup function cuando pierde el foco (opcional)
        console.log("ResourcesTab perdió el foco");
      };
    }, [event_id])
  );

  const handleAddPress = () => {
    // CORREGIDO: Pasar el event_id como objeto con la propiedad "eventId"
    navigation.navigate("AddResource", { eventId: event_id });
  };

  const handleViewDetails = (item) => {
    navigation.navigate("ResourceDetail", { id: item.id, eventId: event_id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando recursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <AddButton onPress={handleAddPress} />
      </View>
    );
  }

  if (resources.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay recursos asignados</Text>
        <AddButton onPress={handleAddPress} />
        <DetailsButton 
          // CORREGIDO: Utilizar la propiedad "eventId" consistentemente
          onPress={() => navigation.navigate("ResourceList", { eventId: event_id })} 
          text="Ver todos los recursos" 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AddButton onPress={handleAddPress} />

      {resources.slice(0, 3).map(item => (
        <ResourceCard
          key={item.id}
          item={item}
          onViewDetails={() => handleViewDetails(item)}
        />
      ))}

      <DetailsButton 
        // CORREGIDO: Utilizar la propiedad "eventId" consistentemente
        onPress={() => navigation.navigate("ResourceList", { eventId: event_id })} 
        text="Ver todos los recursos" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.error,
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 20,
  }
});

export default ResourcesTab;