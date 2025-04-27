import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../../styles/colors';
import AddButton from '../../../../../../components/AddButton';
import DetailsButton from '../../../../../../components/DetailsButtton';

const FoodsTab = ({ foods, loading, event_id, navigation }) => {
  const handleAddPress = () => {
    navigation.navigate("AddFood", { id: event_id });
  };
  
  const handleViewDetails = (item) => {
    navigation.navigate("FoodDetail", { id: item.id, event_id });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando alimentos...</Text>;
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
    <>
      <AddButton onPress={handleAddPress} />
      
      {foods.slice(0, 3).map(item => (
        <SummaryItem
          key={item.id}
          item={item}
          onViewDetails={() => handleViewDetails(item)}
        />
      ))}

      {foods.length > 3 && (
        <DetailsButton 
          onPress={() => navigation.navigate("FoodsList", { id: event_id })} 
          text="Ver todos los alimentos" 
        />
      )}
    </>
  );
};

// Componente para mostrar alimentos
const SummaryItem = ({ item, onViewDetails }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemName}>{item.name}</Text>
    </View>
    
    <View style={styles.itemMeta}>
      <DetailsButton onPress={onViewDetails} />
    </View>
    
    {item.description && (
      <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">
        {item.description}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 20,
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
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingVertical: 12,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontWeight: '600',
    color: colors.gray[800],
    fontSize: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemDescription: {
    color: colors.gray[700],
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FoodsTab;