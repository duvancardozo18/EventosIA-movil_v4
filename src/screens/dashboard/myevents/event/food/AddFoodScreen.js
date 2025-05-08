import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input";
import { colors } from "../../../../../styles/colors";
import { useEvent } from "../../../../../contexts/EventContext";
import { useFood } from "../../../../../contexts/FoodContext";

const AddFoodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Extraer eventId de manera consistente
  const eventId = route.params?.eventId;
  
  // Hooks de contexto
  const { assignFoodToEvent } = useEvent();
  const { createFood } = useFood();

  const [foodData, setFoodData] = useState({ 
    name: "", 
    description: "", 
    quantity: "", 
    unitValue: "" 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Función para manejar los cambios en los campos
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
    if (!foodData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función de envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!eventId) {
      Alert.alert(
        "Error", 
        "No se pudo identificar el evento. Por favor, regresa e intenta de nuevo."
      );
      return;
    }
  
    setLoading(true);
    try {
      // Crear el alimento
      const newFood = await createFood({
        name: foodData.name,
        description: foodData.description,
        quantity_available: Number(foodData.quantity),
        price: Number(foodData.unitValue),
      });
      
      // Obtener el ID del alimento creado
      const foodId = newFood?.id_food || newFood?.id;
      
      if (!foodId) {
        throw new Error("No se pudo obtener el ID del alimento creado");
      }

      // Convertir IDs a números si son strings
      const eventIdNum = typeof eventId === 'string' ? parseInt(eventId) : eventId;
      const foodIdNum = typeof foodId === 'string' ? parseInt(foodId) : foodId;
      
      // Asignar el alimento al evento
      await assignFoodToEvent({
        id_event: eventIdNum,
        id_food: foodIdNum,
      });
      
      // Navegar a la pantalla de éxito
      navigation.navigate("FoodCreated", { 
        event_id: eventId
      });

      // **Resetear los campos** después de crear el alimento
      setFoodData({ name: "", description: "", quantity: "", unitValue: "" });

    } catch (error) {
      console.error("Error creando o asociando alimento:", error);
      
      // Asegurarse de mostrar solo mensajes de error como strings
      const errorMessage = typeof error.message === 'string' 
        ? error.message 
        : 'Error desconocido';
        
      Alert.alert(
        "Error", 
        `No se pudo crear o asignar el alimento: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };   

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left"  marginTop={34} size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Agregar Alimento</Text>

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
            title="CREAR ALIMENTO"
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

export default AddFoodScreen;