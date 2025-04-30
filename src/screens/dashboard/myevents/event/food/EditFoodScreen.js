"use client";

import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFood } from "../../../../../contexts/FoodContext";
import { Feather } from "@expo/vector-icons";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";
import { colors } from "../../../../../styles/colors";

const EditFoodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId, foodId } = route.params;  // Recibimos los parámetros de la ruta
  console.log("id del alimento recibido para editar: ", foodId)
  const { fetchFood, updateFood } = useFood(); // Usamos la función para obtener y actualizar alimentos

  const [foodData, setFoodData] = useState({
    name: "", 
    description: "", 
    quantity: "", 
    unitValue: "" 
  });
  const [initialFoodData, setInitialFoodData] = useState({});  // Guardamos los datos iniciales
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFoodData();
  }, [foodId]); // Cargar datos cuando el foodId cambie

  // Cargar los datos del alimento
  const loadFoodData = async () => {
    setLoading(true);
    try {
      const food = await fetchFood(foodId);
      setFoodData({
        name: food.name || "",
        description: food.description || "",
        quantity: food.quantity_available?.toString() || "",
        unitValue: food.price?.toString() || "",
      });

      // Guardamos los datos iniciales para comparar después
      setInitialFoodData({
        name: food.name || "",
        description: food.description || "",
        quantity: food.quantity_available?.toString() || "",
        unitValue: food.price?.toString() || "",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del alimento. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de cambios en los inputs
  const handleChange = (name, value) => {
    setFoodData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!foodData.name.trim()) newErrors.name = "Campo requerido";
    if (!foodData.quantity.trim()) newErrors.quantity = "Campo requerido";
    else if (isNaN(Number(foodData.quantity)) || Number(foodData.quantity) < 0)
      newErrors.quantity = "Debe ser un número positivo";
      
    if (!foodData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    else if (isNaN(Number(foodData.unitValue)) || Number(foodData.unitValue) < 0)
      newErrors.unitValue = "Debe ser un número positivo";
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si hay cambios
  const hasChanges = () => {
    return (
      foodData.name !== initialFoodData.name ||
      foodData.description !== initialFoodData.description ||
      foodData.quantity !== initialFoodData.quantity ||
      foodData.unitValue !== initialFoodData.unitValue
    );
  };

  // Enviar el formulario para actualizar el alimento
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hasChanges()) {
      Alert.alert("No hay cambios", "No se ha realizado ninguna modificación en los campos.");
      return;
    }

    setLoading(true);
    try {
      const updatedFood = await updateFood(foodId, {
        name: foodData.name,
        description: foodData.description,
        quantity_available: Number(foodData.quantity),
        price: Number(foodData.unitValue),
      });

      if (!updatedFood) {
        throw new Error("No se pudo actualizar el alimento");
      } else {
        // Navegar a la pantalla de confirmación
        navigation.navigate("FoodCreated", {  event_id: eventId });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el alimento. Inténtalo de nuevo.");
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
        <Text style={styles.title}>Editar Alimento</Text>

        <View style={styles.form}>
          <Input
            placeholder="Ingrese el nombre del alimento"
            value={foodData.name}
            onChangeText={(text) => handleChange("name", text)}
            error={errors.name}
          />

          <Input
            placeholder="Ingrese una descripción"
            value={foodData.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={6}
          />

          <Input
            placeholder="Ingrese la cantidad"
            value={foodData.quantity}
            onChangeText={(text) => handleChange("quantity", text)}
            keyboardType="numeric"
            error={errors.quantity}
          />

          <Input
            placeholder="Ingrese el valor unitario"
            value={foodData.unitValue}
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
    padding: 16,
    paddingBottom: 0,
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

export default EditFoodScreen;