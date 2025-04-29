// components/EventFormHeader.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';
import Icon from "react-native-vector-icons/Feather";
import { useEventForm } from './EventFormProvider';

const EventFormHeader = ({ navigation, title }) => {
  const { isEditMode } = useEventForm();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Icon 
          name="arrow-left" 
          size={24} 
          color={colors.gray[800]} 
          marginTop={40}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {isEditMode ? "Editar evento" : "Crear evento"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 40,
  },
});

export default EventFormHeader;