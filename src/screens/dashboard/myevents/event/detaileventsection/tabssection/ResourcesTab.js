import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../../styles/colors';
import AddButton from '../../../../../../components/AddButton';
import DetailsButton from '../../../../../../components/DetailsButtton';

const ResourcesTab = ({ resources, loading, event_id, navigation }) => {
  const handleAddPress = () => {
    navigation.navigate("AddResource", { id: event_id });
  };
  
  const handleViewDetails = (item) => {
    navigation.navigate("ResourceDetail", { id: item.id, event_id });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Cargando recursos...</Text>;
  }
  
  if (resources.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay recursos asignados</Text>
        <AddButton onPress={handleAddPress} />
      </View>
    );
  }
  
  return (
    <>
      <AddButton onPress={handleAddPress} />
      
      {resources.slice(0, 3).map(item => (
        <SummaryItem
          key={item.id}
          item={item}
          isResource={true}
          onViewDetails={() => handleViewDetails(item)}
        />
      ))}

      {resources.length > 3 && (
        <DetailsButton 
          onPress={() => navigation.navigate("ResourcesList", { id: event_id })} 
          text="Ver todos los recursos" 
        />
      )}
    </>
  );
};

// Componente para mostrar recursos
const SummaryItem = ({ item, isResource = true, onViewDetails }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
    </View>
    
    <View style={styles.itemMeta}>
      <View style={styles.quantityContainer}>
        <View style={styles.quantityDot}>
          <View style={styles.quantityDotInner} />
        </View>
        <Text style={styles.quantityText}>{item.quantity_available} unidades</Text>
      </View>
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
  itemPrice: {
    fontWeight: '600',
    color: colors.indigo[500],
    fontSize: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.indigo[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.indigo[500],
  },
  quantityText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  itemDescription: {
    color: colors.gray[700],
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ResourcesTab;