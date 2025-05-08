import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';

const Card = ({ item, onViewDetails }) => (
<TouchableOpacity 
  style={styles.cardContainer} 
  onPress={() => onViewDetails && onViewDetails(item)}
>
  <View style={styles.cardContent}>
    <Text style={styles.itemName}>{item.name}</Text>
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityText}>
      <Text style={styles.units}>Unidades: {item.quantity_available}{"\n"}</Text>
        Valor Unitario: ${item.price}{"\n"}
      </Text>
    </View>
    <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">
      {item.description || "Sin Descripcion"}
    </Text>
  </View>
  <Text style={styles.itemPrice}>$ {item.price && item.quantity_available ? (item.price * item.quantity_available).toLocaleString() : "0"}</Text>
</TouchableOpacity>

);

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
  itemPrice: {
    fontWeight: '600',
    color: '#5B21B6', // Indigo más intenso como en la imagen
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  quantityText: {
    color: colors.gray[600],
    fontSize: 13,
  },
  itemDescription: {
    color: colors.gray[500],
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});

export default Card;