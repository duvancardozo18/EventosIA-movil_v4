import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FloatingChatButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
        accessible={true}
        accessibilityLabel="Abrir chat"
        style={styles.button}
        onPress={() => navigation.navigate('ChatBotScreen')}
    >

      <Text style={styles.text}>💬</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 5,
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
});

export default FloatingChatButton;
