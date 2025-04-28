import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const CardList = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.quantityText}>Cantidad: {item.quantity}</Text>
          <Text style={styles.priceText}>Valor Unitario: ${item.price}</Text>
          <Text style={styles.priceText}>Costo Total: ${item.totalCost}</Text>
          {item.description && <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>}
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        {onEdit && (
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Feather name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Feather name="trash-2" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontWeight: '600',
    color: colors.gray[800],
    fontSize: 16,
    marginBottom: 4,
  },
  detailsContainer: {
    marginTop: 8,
  },
  quantityText: {
    color: colors.gray[600],
    fontSize: 13,
  },
  priceText: {
    color: colors.gray[600],
    fontSize: 13,
    marginTop: 4,
  },
  itemDescription: {
    color: colors.gray[500],
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CardList;