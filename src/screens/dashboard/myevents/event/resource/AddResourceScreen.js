import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useResource } from "../../../../../contexts/ResourceContext";
import { Feather } from "@expo/vector-icons";
import Button from "../../../../../components/Button";
import Input from "../../../../../components/Input"; // Tu componente Input
import { colors } from "../../../../../styles/colors";
import { useEvent } from "../../../../../contexts/EventContext";

const AddResourceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // CORREGIDO: Extraer eventId de forma consistente del objeto params
  const { eventId } = route.params || {};
  
  console.log("Event ID received in AddResourceScreen:", eventId);
  
  const { createResource } = useResource();
  const { assignResourceToEvent } = useEvent();

  const [resourceData, setResourceData] = useState({
    name: "",
    description: "",
    quantity: "",
    unitValue: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setResourceData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!resourceData.name.trim()) newErrors.name = "Campo requerido";
    if (!resourceData.quantity.trim()) newErrors.quantity = "Campo requerido";
    if (!resourceData.unitValue.trim()) newErrors.unitValue = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Crear recurso
      const newResource = await createResource({
        name: resourceData.name,
        description: resourceData.description,
        quantity_available: Number(resourceData.quantity),
        price: Number(resourceData.unitValue),
      });

      // Verifica la estructura del objeto newResource para identificar el ID correcto
      const resourceId = newResource.id_resource || newResource.id || newResource._id;

      if (!resourceId) {
        throw new Error("No se pudo obtener el ID del recurso creado");
      }

      // Convertir explícitamente a números para evitar problemas de tipo
      const eventIdNum = parseInt(eventId);
      console.log("Event ID:", eventIdNum);
      const resourceIdNum = parseInt(resourceId);

      if (isNaN(eventIdNum) || isNaN(resourceIdNum)) {
        throw new Error(`ID inválido: evento=${eventId}, recurso=${resourceId}`);
      }

      const newEventResource = await assignResourceToEvent({
        id_event: eventIdNum,
        id_resource: resourceIdNum
      });

      // CORREGIDO: Pasar eventId como parte de un objeto
      navigation.navigate("ResourceCreated", { eventId });

      // Limpiar los campos después de agregar el recurso
      setResourceData({ name: "", description: "", quantity: "", unitValue: "" });
      setErrors({}); // Limpiar los errores
    } catch (error) {
      console.error("Error creando o asociando recurso:", error);
      Alert.alert("Error", `No se pudo crear o asignar el recurso: ${error.message}`);
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
        <Text style={styles.title}>Agregar Recurso</Text>

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
            title="CREAR RECURSO"
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

export default AddResourceScreen;