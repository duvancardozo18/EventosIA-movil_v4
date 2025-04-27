import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../styles/colors';

const DetailsButton = ({ onPress, text = "Ver detalles" }) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
      <Icon name="chevron-right" size={16} color={colors.indigo[500]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.indigo[500],
    fontWeight: '500',
    marginRight: 4,
    fontSize: 14,
  }
});

export default DetailsButton;