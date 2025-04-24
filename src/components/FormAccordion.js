import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../styles/colors";

export const FormAccordion = ({ title, isOpen, children, onToggle }) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Icon 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.gray[700]} 
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 8,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    backgroundColor: colors.gray[100],
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
  },
  accordionContent: {
    paddingTop: 8,
  },
});