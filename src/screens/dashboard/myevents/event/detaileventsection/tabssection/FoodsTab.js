import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../../../../../styles/colors';
import AddButton from '../../../../../../components/AddButton';
import DetailsButton from '../../../../../../components/DetailsButtton';
import { useFocusEffect } from '@react-navigation/native';
import { useEvent } from '../../../../../../contexts/EventContext';
import Card from '../../../../../../components/Card'; // Nuevo import

const FoodsTab = ({ navigation, event_id }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchEventFoods } = useEvent();

  const loadFoods = async () => {
    setLoading(true);
    try {
      const foodData = await fetchEventFoods(event_id);
      setFoods(foodData);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los alimentos. Por favor, intenta de nuevo.");
      console.error("Error loading foods:", err);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    loadFoods();
  }, [event_id]);

  useFocusEffect(
    React.useCallback(() => {
      loadFoods();
      return () => {};
    }, [event_id])
  );

  const handleAddPress = () => {
    navigation.navigate("AddFood", { event_id });
  };
  
  const handleViewDetails = (item) => {
    navigation.navigate("FoodDetails", { foodId: item.id, event_id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando alimentos...</Text>
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
  
  if (foods.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay alimentos asignados</Text>
        <AddButton onPress={handleAddPress} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <AddButton onPress={handleAddPress} />
      
      {foods.slice(0, 3).map(item => (
        <Card
          key={item.id}
          item={{
            ...item,
            quantity_available: item.quantity || item.stock,
            description: item.description || "Descripción no disponible"
          }}
          onViewDetails={() => handleViewDetails(item)}
        />
      ))}

      {foods.length > 3 && (
        <DetailsButton 
          onPress={() => navigation.navigate("FoodList", { event_id: event_id })} 
          text="Ver todos los alimentos" 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
});

export default FoodsTab;