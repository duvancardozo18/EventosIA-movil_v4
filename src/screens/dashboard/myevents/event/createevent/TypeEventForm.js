import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { categoryService } from "../../../../../services/api";
import { colors } from "../../../../../styles/colors";
import { FormDateTimePicker } from "../../../../../components/FormDateTimePicker";
import { FormSelectPicker } from "../../../../../components/FormSelectPicker";
import { FormTextInput } from "../../../../../components/FormTextInput";

export default function CreateTypeEventForm({ onChange, formData }) {
  // Estados iniciales y configuración
  const [typeEventData, setTypeEventData] = useState({
    event_type: "",
    description: "",
    video_conference_link: "",
    max_participants: null,
    category_id: undefined,
    price: null,
    start_time: "",
    end_time: "",
  });
  
  // Estados para fechas y horas combinadas
  const [dates, setDates] = useState({
    startDateTime: new Date(),
    endDateTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Default: 1 hora después
  });
  
  const [categories, setCategories] = useState([]);
  
  const modeOptions = [
    { value: "virtual", label: "Virtual" },
    { value: "presencial", label: "Presencial" },
    { value: "hibrido", label: "Híbrido" },
  ];

  // Sincronizar con formData del componente padre
  useEffect(() => {
    if (formData) {
      setTypeEventData(formData);
      
      // Actualizar fechas si existen en formData
      if (formData.start_time) {
        const startDate = new Date(formData.start_time);
        setDates(prev => ({
          ...prev,
          startDateTime: startDate
        }));
      }
      
      if (formData.end_time) {
        const endDate = new Date(formData.end_time);
        setDates(prev => ({
          ...prev,
          endDateTime: endDate
        }));
      }
    }
    
    // Cargar categorías
    fetchCategories();
  }, [formData]);

  // Actualizar el estado del typeEventData y notificar al padre
  const handleChange = (name, value) => {
    const updated = { ...typeEventData, [name]: value };
    setTypeEventData(updated);
    onChange?.(updated);
  };

  

  // Update the handleStartDateTimeChange function
  const handleStartDateTimeChange = (dateTime) => {
    // Make sure the date is valid
    if (!(dateTime instanceof Date) || isNaN(dateTime.getTime())) {
      return;
    }
    
  // Update dates state
    setDates(prev => {
      // If end date is now before start date, update it too
      const needsEndUpdate = dateTime >= prev.endDateTime;
      const newEndDateTime = needsEndUpdate ? 
        new Date(dateTime.getTime() + 60 * 60 * 1000) : prev.endDateTime;
        
      if (needsEndUpdate) {
        handleChange('end_time', newEndDateTime.toISOString());
      }
      
      return {
        startDateTime: dateTime,
        endDateTime: needsEndUpdate ? newEndDateTime : prev.endDateTime
      };
    });
    
    // Update form data
    handleChange('start_time', dateTime.toISOString());
  };
  
  // Cargar categorías desde API
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  // Convertir categorías al formato requerido por FormSelectPicker
  const categoryOptions = categories.map(cat => ({
    value: cat.id_category,
    label: cat.name
  }));

  const handleDateTimeChange = (type, dateTime) => {
    if (!(dateTime instanceof Date) || isNaN(dateTime.getTime())) return;
  
    const dateField = type === 'start' ? 'startDateTime' : 'endDateTime';
    const formField = type === 'start' ? 'start_time' : 'end_time';
  
    setDates(prev => {
      if (type === 'start' && dateTime >= prev.endDateTime) {
        const newEnd = new Date(dateTime.getTime() + 60 * 60 * 1000);
        handleChange('end_time', newEnd.toISOString());
        return { startDateTime: dateTime, endDateTime: newEnd };
      }
      return { ...prev, [dateField]: dateTime };
    });
  
    handleChange(formField, dateTime.toISOString());
  };
  

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Tipo de Evento</Text>

      {/* Picker de categoría */}
      <FormSelectPicker
        label="Tipo de Evento"
        placeholder="Selecciona una categoría"
        selectedValue={typeEventData.category_id}
        onValueChange={value => handleChange("category_id", value)}
        options={categoryOptions}
        required
      />

      {/* Picker de modalidad */}
      <FormSelectPicker
        label="Modalidad"
        placeholder="Selecciona la modalidad"
        selectedValue={typeEventData.event_type}
        onValueChange={value => handleChange("event_type", value)}
        options={modeOptions}
        required
      />

      {/* Campos de texto */}
      <FormTextInput
        label="Descripción"
        placeholder="Describe el evento"
        value={typeEventData.description}
        onChangeText={text => handleChange("description", text)}
        required
      />

      {typeEventData.event_type !== "presencial" && (
        <FormTextInput
          label="Link de videoconferencia"
          placeholder="URL de la videoconferencia"
          value={typeEventData.video_conference_link}
          onChangeText={text => handleChange("video_conference_link", text)}
        />
      )}

      <FormTextInput
        label="Máximo de participantes"
        placeholder="Número máximo de asistentes"
        value={typeEventData.max_participants}
        onChangeText={text => handleChange("max_participants", Number(text) || null)}
        keyboardType="numeric"
      />

      <FormTextInput
        label="Precio"
        placeholder="Precio del evento"
        value={typeEventData.price}
        onChangeText={text => handleChange("price", Number(text) || null)}
        keyboardType="numeric"
      />

      {/* Selectores de fecha y hora combinados */}
      <FormDateTimePicker
        label="Fecha y hora de inicio"
        value={dates.startDateTime}
        onChange={(date) => handleDateTimeChange('start', date)}
        required
      />

      <FormDateTimePicker
        label="Fecha y hora de finalización"
        value={dates.endDateTime}
        onChange={(date) => handleDateTimeChange('end', date)}
        minimumDate={dates.startDateTime}
        required
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.gray[800],
  }
});