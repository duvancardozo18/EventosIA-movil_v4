"use client"

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";

const EditEventButton = ({ onPress, title = "Editar Evento", style = {} }) => {
  return (
    <TouchableOpacity 
      style={[styles.editButton, style]} 
      onPress={onPress}
    >
    <Feather name="edit" size={18} color={colors.indigo[600]} />
      <Text style={styles.editButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.indigo[400],
    borderRadius: 8,
    paddingVertical: 10,         // Aumentado de 8 a 10
    paddingHorizontal: 20,       // Aumentado de 16 a 20
    marginVertical: 16,
    alignSelf: 'center',
    minWidth: 150,               // Añadido para asegurar un ancho mínimo
    backgroundColor: 'white',
    shadowColor: '#0000001A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    marginLeft: 8,               // Aumentado de 6 a 8
    color: colors.indigo[600],
    fontWeight: '500',
    fontSize: 15,                // Aumentado de 14 a 15
  }
});

export default EditEventButton;