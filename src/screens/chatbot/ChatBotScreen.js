// components/ChatBot.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from "../../styles/colors";
import Icon from "react-native-vector-icons/Feather"
import { useNavigation, useRoute } from "@react-navigation/native"




const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation()

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Agregar mensaje del usuario
    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simular respuesta del bot
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        text: getBotResponse(inputText), 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    // Lógica simple de respuestas
    userInput = userInput.toLowerCase();
    if (userInput.includes('hola') || userInput.includes('hi')) {
      return '¡Hola! ¿Cómo estás?';
    } else if (userInput.includes('gracias')) {
      return 'De nada, ¿en qué más puedo ayudarte?';
    } else {
      return 'No estoy seguro de entender. ¿Puedes reformular tu pregunta?';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" marginTop={34} size={24} color={colors.gray[800]} />
          </TouchableOpacity>
            <Text style={styles.headerTitle}>Chatbot</Text>
          </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.message, 
            item.sender === 'user' ? styles.userMessage : styles.botMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu mensaje..."
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
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
      marginTop: 25,
    },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  borderColor: '#DDD',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatBot;