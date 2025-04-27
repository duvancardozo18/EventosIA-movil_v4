import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({
  title,
  onPress,
  backgroundColor = '#4F46E5', // Por defecto azul indigo
  color = 'white',             // Color de texto
  width = '80%',               // Por defecto 80% del contenedor
  height = 50,                 // Alto por defecto
  borderRadius = 8,            // Bordes redondeados
  fontSize = 16,               // Tamaño de letra
  fontWeight = '600',          // Peso de la letra
  marginTop = 10,              // Espaciado arriba
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, width, height, borderRadius, marginTop }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color, fontSize, fontWeight }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',  // 👈 esto asegura que el botón se centre dentro del padre
  },
  text: {
    textAlign: 'center',
  },
});
