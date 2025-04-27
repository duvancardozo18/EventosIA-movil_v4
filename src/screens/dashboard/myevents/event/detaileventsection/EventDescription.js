import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';

const EventDescription = ({ description }) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.descriptionTitle}>Descripción</Text>
    <Text style={styles.descriptionText}>
      {description || "Sin descripción disponible."}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  descriptionContainer: {
    padding: 16,
    paddingTop: 0,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray[700],
  },
});

export default EventDescription;