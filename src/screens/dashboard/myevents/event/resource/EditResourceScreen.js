"use client";

import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useResource } from "../../../../../contexts/ResourceContext";
import { Feather } from "@expo/vector-icons";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input"; // Tu componente Input
import { colors } from "../../../../../styles/colors";

const EditResourceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId, resourceId } = route.params;  // Recibimos los parámetros de la ruta.
  const { fetchResource, updateResource } = useResource(); // Usamos la función para obtener y actualizar recursos

  const [resourceData, setResourceData] = useState({
    name: "", 
    description: "", 
    quantity: "", 
    unitValue: "" 
  });
  const [initialResourceData, setInitialResourceData] = useState({});  // Guardamos los datos iniciales
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadResourceData();
  }, [resourceId]); // Cargar datos cuando el resourceId cambie

  // Cargar los datos del recurso
  const loadResourceData = async () => {
    setLoading(true);
    try {
      const resource = await fetchResource(resourceId);
      setResourceData({
        name: resource.name || "",
        description: resource.description || "",
        quantity: resource.quantity_available?.toString() || "",
        unitValue: resource.price?.toString() || "",
      });

      // Guardamos los datos iniciales para comparar después
      setInitialResourceData({
        name: resource.name || "",
        description: resource.description || "",
        quantity: resource.quantity_available?.toString() || "",
        unitValue: resource.price?.toString() || "",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del recurso. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambios en los inputs
  const handleChange = (name, value) => {
    setResourceData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!resourceData.name.trim()) newErrors.name = "Campo requerido";
    if (!resourceData.quantity.trim()) newErrors.quantity = "Campo requerido";
    if (!resourceData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si hay cambios
  const hasChanges = () => {
    return (
      resourceData.name !== initialResourceData.name ||
      resourceData.description !== initialResourceData.description ||
      resourceData.quantity !== initialResourceData.quantity ||
      resourceData.unitValue !== initialResourceData.unitValue
    );
  };

  // Enviar el formulario para actualizar el recurso
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hasChanges()) {
      Alert.alert("No hay cambios", "No se ha realizado ninguna modificación en los campos.");
      return;
    }

    setLoading(true);
    try {
      const updatedResource = await updateResource(resourceId, {
        name: resourceData.name,
        description: resourceData.description,
        quantity_available: Number(resourceData.quantity),
        price: Number(resourceData.unitValue),
      });

      if (!updatedResource) {
        throw new Error("No se pudo actualizar el recurso");} 
      else {       // Navegar de vuelta al listado de recursos o pantalla anterior
        navigation.navigate("ResourceCreated", { eventId } );}
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el recurso. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editar Recurso</Text>

        <View style={styles.form}>
          <Input
            placeholder="Ingrese el nombre del recurso"
            value={resourceData.name}
            onChangeText={(text) => handleChange("name", text)}
            error={errors.name}
          />

          <Input
            placeholder="Ingrese una descripción"
            value={resourceData.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={6}
          />

          <Input
            placeholder="Ingrese la cantidad"
            value={resourceData.quantity}
            onChangeText={(text) => handleChange("quantity", text)}
            keyboardType="numeric"
            error={errors.quantity}
          />

          <Input
            placeholder="Ingrese el valor unitario"
            value={resourceData.unitValue}
            onChangeText={(text) => handleChange("unitValue", text)}
            keyboardType="numeric"
            error={errors.unitValue}
          />

          <Button
            title="GUARDAR CAMBIOS"
            onPress={handleSubmit}
            loading={loading}
            marginTop={24}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gray[800],
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 16,
  },
});

export default EditResourceScreen;