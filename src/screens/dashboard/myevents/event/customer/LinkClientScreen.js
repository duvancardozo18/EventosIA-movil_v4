"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEvent } from "../../../../../contexts/EventContext";
import { Feather } from "@expo/vector-icons";

const LinkClientScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  const { linkClientToEvent } = useEvent();

  const [clientData, setClientData] = useState({
    name: "",
    lastname: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!clientData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!clientData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await linkClientToEvent(eventId, clientData);
      navigation.navigate("QuoteSentScreen", { eventId });
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo enlazar el cliente al evento. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
      navigation.navigate("BillSent")
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Enlazar Cliente</Text>
          <Text style={styles.subtitle}>(envío de cotización)</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={clientData.name}
                onChangeText={(text) => handleChange("name", text)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={clientData.lastname}
                onChangeText={(text) => handleChange("lastname", text)}
              />
            </View>
            {errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={clientData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "ENVIANDO..." : "ENVIAR"}
            </Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 20,
  },
  backButton: {
    padding: 5,
  },
  formWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#888888",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    padding: 0,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4F4FFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});

export default LinkClientScreen;