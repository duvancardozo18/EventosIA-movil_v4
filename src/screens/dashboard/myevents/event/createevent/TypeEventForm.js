import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from "react-native";
import { categoryService } from "../../../../../services/api";
import { colors } from "../../../../../styles/colors";

export default function CreateTypeEventForm({ onChange, formData }) {

  const initialData = {
    event_type: "",
    description: "",
    video_conference_link: "",
    max_participants: null,
    category_id: undefined,
    price: null,
    start_time: null,
    end_time: null,
  };

  // Definición del estado para las fechas de inicio y fin
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]); // Inicializa con la fecha actual en formato YYYY-MM-DD
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]); // Inicializa con la fecha actual en formato YYYY-MM-DD
  const [categories, setCategories] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const modeOptions = [
    { value: "virtual", label: "Virtual" },
    { value: "presencial", label: "Presencial" },
    { value: "hibrido", label: "Híbrido" },
  ];

  const [typeEventData, setTypeEventData] = useState(initialData);

  // useEffect to sync formData with the parent component
  useEffect(() => {
    if (formData) {
      setTypeEventData(formData);  // Important to keep the data synced
    }
  }, [formData]);  // The effect will run only when `formData` changes

  const handleChange = (name, value) => {
    const updated = {
      ...typeEventData,
      [name]: value,
    };
    setTypeEventData(updated);
    onChange?.(updated);  // Notify the parent component with updated data
  };

  const handleDateChange = (name, value) => {
    if (name === "start_time") {
      setStartDate(value);
    } else if (name === "end_time") {
      setEndDate(value);
    }
    handleChange(name, value);
  };

  useEffect(() => {
    onChange?.(typeEventData);  // Sync data with parent whenever it changes

    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };

    fetchCategories();
  }, [typeEventData]);  // Fetch categories only if `typeEventData` changes

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Tipo de Evento</Text>

      {/* Picker de categoría */}
      <Text style={styles.label}>Tipo de Evento *</Text>
      <Picker
        selectedValue={typeEventData.category_id}
        onValueChange={(value) => {
          handleChange("category_id", value);  // Save the selected category ID
          console.log("Categoría seleccionada:", value);  // Log the selected category ID
        }}
        style={styles.picker}
        dropdownIconColor={colors.gray[600]} // for Android
      >
        <Picker.Item label="Selecciona una categoría" value={undefined} />
        {categories.map((cat) => (
          <Picker.Item key={cat.id_category} label={cat.name} value={cat.id_category} />
        ))}
      </Picker>

      {/* Picker de modalidad */}
      <Text style={styles.label}>Modalidad *</Text>
      <Picker
        selectedValue={typeEventData.event_type}
        onValueChange={(value) => handleChange("event_type", value)}
        style={styles.picker}
        dropdownIconColor={colors.gray[600]}
      >
        <Picker.Item label="Selecciona la modalidad" value={undefined} key="default-category" />
        {modeOptions.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={typeEventData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      {typeEventData.event_type !== "presencial" && (
        <TextInput
          style={styles.input}
          placeholder="Link de videoconferencia"
          value={typeEventData.video_conference_link}
          onChangeText={(text) => handleChange("video_conference_link", text)}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Máximo de participantes"
        value={typeEventData.max_participants?.toString() || ""}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("max_participants", Number(text))}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={typeEventData.price?.toString() || ""}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("price", Number(text))}
      />

      {/* Manual Input de Fecha de Inicio */}
      <TextInput
        style={styles.input}
        placeholder="Inicio (YYYY-MM-DD)"
        value={startDate}
        onChangeText={(text) => handleDateChange("start_time", text)}
      />

      {/* Manual Input de Fecha de Fin */}
      <TextInput
        style={styles.input}
        placeholder="Fin (YYYY-MM-DD)"
        value={endDate}
        onChangeText={(text) => handleDateChange("end_time", text)}
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
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    marginBottom: 12,
  },
  
  picker: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,            // 🟢 suavizado extra
    marginBottom: 12,            // 🟢 espacio consistente con los inputs
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    color: colors.gray[800],
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  
})
