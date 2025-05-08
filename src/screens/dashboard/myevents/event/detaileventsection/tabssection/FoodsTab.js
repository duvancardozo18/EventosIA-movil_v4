import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { colors } from '../../../../../../styles/colors';
import AddButton from '../../../../../../components/AddButton';
import DetailsButton from '../../../../../../components/DetailsButtton';
import FoodCard from '../../../../../../components/Card';  // Usamos la tarjeta de alimentos
import { useEvent } from '../../../../../../contexts/EventContext';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from "../../../../../../contexts/AuthContext";


const FoodsTab = ({ navigation, event_id }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  

  const { fetchEventFoods } = useEvent();

  console.log("Event ID in FoodsTab:", event_id);

  // Función para cargar los alimentos
  const loadFoods = async () => {
    setLoading(true);
    try {
      const foodData = await fetchEventFoods(event_id);
      console.log("Fetched Foods:", foodData);
      setFoods(foodData);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los alimentos. Por favor, intenta de nuevo.");
      console.error("Error loading foods:", err);
    } finally {
      setLoading(false);
    }
  };  

  // Cargar alimentos cuando el componente se monta inicialmente
  useEffect(() => {
    loadFoods();
  }, [event_id]);

  // Recargar alimentos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    React.useCallback(() => {
      console.log("FoodsTab recibió el foco - recargando alimentos...");
      loadFoods();
      return () => {
        // Cleanup function cuando pierde el foco (opcional)
        console.log("FoodsTab perdió el foco");
      };
    }, [event_id])
  );

  const handleAddPress = () => {
    navigation.navigate("AddFood", { eventId: event_id });
  };

  // Cargando alimentos o mostrando un error
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
      </View>
    );
  }

  // Si no hay alimentos, mostrar el mensaje y el botón de agregar
  if (foods.length === 0) {
    return (
      <View style={styles.container}>
        {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
        <AddButton onPress={handleAddPress} />
        )}
        <View style={styles.emptyMessageContainer}>
          <Feather name="coffee" size={60} color={colors.gray[400]} />
          <Text style={styles.emptyText}>No hay alimentos</Text>
          <Text style={styles.emptySubtext}>Agrega alimentos para tu evento</Text>
        </View>
      </View>
    );
  }

  // Si hay alimentos, mostrar los primeros 3 y el botón "Ver todos los alimentos"
  return (
    <View style={styles.container}>
      {(user?.role === "SuperAdmin" || user?.role === "EventManager") && (
        <AddButton onPress={handleAddPress} />
      )}
      {/* Mostrar solo los primeros 3 alimentos */}
      {foods.slice(0, 3).map(item => (
        <FoodCard
        key={item.id}
        item={item}
        />
      ))}
       <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("FoodList", { event_id: event_id })}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
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
  emptyMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 20,
    maxWidth: '80%',
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    marginTop: 8, 
  },  
  viewAllText: {
    color: colors.indigo[500],
    fontWeight: '500',
  },
});

export default FoodsTab;