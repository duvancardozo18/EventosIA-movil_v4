"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import * as ImagePicker from "expo-image-picker"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useEvent } from "../../../../contexts/EventContext"
import { useLocation } from "../../../../contexts/LocationContext"
import { useEventType } from "../../../../contexts/EventTypeContext"
import { useCategory } from "../../../../contexts/CategoryContext"
import { useAuth } from "../../../../contexts/AuthContext"
import { colors } from "../../../../styles/colors"
import { Alert } from 'react-native'

export default function EditEventScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { event_id } = route.params 
  const { fetchEvent, updateEvent, loading, error } = useEvent()
  const { updateEventType } = useEventType()
  const { updateLocation } = useLocation()
  const { categories, getCategories } = useCategory()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const userId = user?.id_user
  
  // Estado para controlar la carga inicial del evento
  const [isLoading, setIsLoading] = useState(true)
  const [eventData, setEventData] = useState(null)
  
  // Estado para el formulario, inicializado con valores vacíos
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    event_state_id: "",
    id_category:"",
    event_modality: "",
    user_id_created_by: userId || "",
    image: null,
    image_url: null, 
    video_conference_link: "",
    max_participants: "",
    price_event: "",
    start_time: null,
    end_time: null,
    location_name: "",
    location_address: "",
    location_description: "",
    location_rental_price: ""
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [showStartDate, setShowStartDate] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)

useEffect(() => {
  const fetchEventData = async () => {
    try {
      const event = await fetchEvent(event_id);
      // Cargar categorías
      await getCategories()

      if (event) {
        setEventData(event);

        // Actualizar el formulario con los datos del evento
        setFormData({
          name: event.event_name || "",
          description: event.event_type_description || "",
          image_url: event.image_url?.[0] || null,
          event_state_id: event.id_event_state || 1,
          event_modality: event.event_type || "",
          categories_id: event.id_category || "",
          user_id_created_by: event.user_id_created_by || "",
          video_conference_link: event.video_conference_link || "",
          max_participants: event.max_participants?.toString() || "",
          price_event: event.event_price?.toString() || "",
          start_time: event.start_time ? new Date(event.start_time) : null,
          end_time: event.end_time ? new Date(event.end_time) : null,
          location_name: event.location_name || "",
          location_address: event.location_address || "",
          location_description: event.location_description || "",
          location_rental_price: event.location_price?.toString() || ""
        });

        // Configurar la vista previa de la imagen si existe
        if (event.image_url && event.image_url.length > 0) {
          setImagePreview(event.image_url[0]); // Take the first image URL
        }
      } else {
        Alert.alert(
          "Error",
          "No se pudo cargar la información del evento",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error("Error al cargar el evento:", error);
      Alert.alert(
        "Error",
        "No se pudo cargar la información del evento",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  fetchEventData();
}, [event_id]);  

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



  const handleDateChange = (event, selectedDate, type) => {
    if (selectedDate) {
      if (type === "startDate") {
        const newDate = new Date(selectedDate)
        if (formData.start_time) {
          newDate.setHours(formData.start_time.getHours(), formData.start_time.getMinutes())
        }
  
        setFormData((prev) => ({
          ...prev,
          start_time: newDate,
        }))
        setShowStartDate(false)
      } else if (type === "startTime") {
        const newDate = formData.start_time ? new Date(formData.start_time) : new Date()
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes())
  
        setFormData((prev) => ({
          ...prev,
          start_time: newDate,
        }))
        setShowStartTime(false)
      } else if (type === "endDate") {
        const newDate = new Date(selectedDate)
        if (formData.end_time) {
          newDate.setHours(formData.end_time.getHours(), formData.end_time.getMinutes())
        }
  
        setFormData((prev) => ({
          ...prev,
          end_time: newDate,
        }))
        setShowEndDate(false)
      } else if (type === "endTime") {
        const newDate = formData.end_time ? new Date(formData.end_time) : new Date()
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes())
  
        setFormData((prev) => ({
          ...prev,
          end_time: newDate,
        }))
        setShowEndTime(false)
      }
    } else {
      if (type === "startDate") setShowStartDate(false)
      if (type === "startTime") setShowStartTime(false)
      if (type === "endDate") setShowEndDate(false)
      if (type === "endTime") setShowEndTime(false)
    }
  }

// Modificación de la función pickImage para mantener la referencia a image_url
const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (status !== "granted") {
    alert("Se necesitan permisos para acceder a la galería")
    return
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  })

  if (!result.cancelled && result.assets && result.assets.length > 0) {
    const selectedImage = result.assets[0]
    setFormData((prev) => ({
      ...prev,
      image: selectedImage,
      // No eliminamos image_url, solo agregamos la nueva imagen
    }))
    setImagePreview(selectedImage.uri)
  }
}

const handleSubmit = async () => {
  try {
    // Validaciones
    if (!formData.location_name) {
      Alert.alert("Campo requerido", "Por favor ingrese el nombre del lugar", [{ text: "OK" }]);
      return;
    }

    if (!formData.location_address) {
      Alert.alert("Campo requerido", "Por favor ingrese la dirección del lugar", [{ text: "OK" }]);
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      Alert.alert("Campo requerido", "Por favor ingrese la fecha y hora del evento", [{ text: "OK" }]);
      return;
    }

    // 1. Actualizar tipo de evento
    const typeEventResponse = await updateEventType(eventData.id_type_of_event, {
      name: formData.name,
      description: formData.description || "",
      event_type: formData.event_modality || "",
      start_time: formData.start_time || "",
      end_time: formData.end_time || "",
      video_conference_link: formData.video_conference_link || "",
      price: formData.price_event || "",
      category_id: formData.categories_id || "",
      max_participants: formData.max_participants || 0
    });

    if (!typeEventResponse) {
      throw new Error("Error al actualizar el tipo de evento");
    }

    // 2. Actualizar la ubicación
    const locationResponse = await updateLocation(eventData.id_location, {
      name: formData.location_name,
      address: formData.location_address,
      description: formData.location_description || "",
      price: formData.location_rental_price || 0
    });

    if (!locationResponse) {
      throw new Error("Error al actualizar la ubicación");
    }

    // 3. Preparar FormData para actualizar el evento
    const eventFormData = new FormData();
    
    eventFormData.append('name', formData.name);
    eventFormData.append('type_of_event_id', eventData.id_type_of_event);
    eventFormData.append('location_id', eventData.id_location);
    eventFormData.append('event_state_id', String(formData.event_state_id));
    eventFormData.append('user_id_created_by', String(userId));
    
    if (formData.image) {
      const localUri = formData.image.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      eventFormData.append("image", {
        uri: localUri,
        name: filename,
        type
      });
    } else if (formData.image_url) {
      eventFormData.append("image_url", formData.image_url);
    }



   
    // 4. Actualizar el evento
    const success = await updateEvent(event_id, eventFormData);
    
    if (success) {
      navigation.replace("EventDetail", { event_id });
    } 
  } catch (error) {
    console.error("Error completo:", error);
    alert(`Error: ${error.message}`);
  }
};

  const nextStep = () => {
    if (currentStep === 1 && !formData.name) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese el nombre del evento",
        [{ text: "OK" }]
      );
      return;
    }

    if (currentStep === 1 && !formData.categories_id) {
      Alert.alert(
        "Campo requerido",
        "Por favor seleccione una categoría",
        [{ text: "OK" }]
      );
      return;
    }

    if (currentStep === 2 && !formData.event_modality) {
      Alert.alert(
        "Campo requerido",
        "Por favor seleccione el tipo de evento",
        [{ text: "OK" }]
      );
      return;
    }

    if (currentStep === 2 && !formData.max_participants) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese el numero máximo de participantes",
        [{ text: "OK" }]
      );
      return;
    }


    if (currentStep === 2 && !formData.price_event) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese el precio del evento",
        [{ text: "OK" }]
      );
      return;
    }

    if (currentStep === 2 && (!formData.start_time || !formData.end_time)) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese la fecha y hora del evento",
        [{ text: "OK" }]
      );
      return;
    }

    if (currentStep === 2 && formData.start_time >= formData.end_time) {
      Alert.alert(
        "Fecha inválida",
        "La fecha de finalización no puede ser anterior o igual a la fecha de inicio",
        [{ text: "OK" }]
      );
      return;
    }

  
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const renderStep1 = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre del evento *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          placeholder="Nombre del evento"
          maxLength={50}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          placeholder="Descripción del evento"
          multiline
          numberOfLines={4}
          maxLength={220}
        />
      </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Categoria *<Text style={{ color: 'red' }}>*</Text></Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.categories_id}
            onValueChange={(value) => handleChange("categories_id", value)}
            style={styles.picker}
          >
            {categories.map((category) => (
              <Picker.Item 
                key={category.id_category} 
                label={category.name} 
                value={category.id_category} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Imagen</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {formData.image ? formData.image.fileName || "Imagen seleccionada" : 
             imagePreview ? "Imagen actual" : "Seleccionar imagen"}
          </Text>
          <Icon name="upload" size={20} color={colors.gray[500]} />
        </TouchableOpacity>
        {imagePreview && <Image source={{ uri: imagePreview }} style={styles.imagePreview} />}
      </View>
    </>
  )

  const renderStep2 = () => (
    <>
    <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de evento *</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={formData.event_modality}
                onValueChange={(value) => handleChange("event_modality", value)}
                style={styles.picker}
            >
                <Picker.Item label="Virtual" value="virtual" />
                <Picker.Item label="Presencial" value="presencial" />
                <Picker.Item label="Híbrido" value="hibrido" />
            </Picker>
        </View>
    </View>

    {(formData.event_modality === 'virtual' || formData.event_modality === 'hibrido') && (
        <View style={styles.formGroup}>
            <Text style={styles.label}>Enlace del meet</Text>
            <TextInput
              style={styles.input}
              value={formData.video_conference_link}
              onChangeText={(value) => handleChange("video_conference_link", value)}
              placeholder="Enlace de videoconferencia"
              maxLength={100}
            />
        </View>
    )}

    <View style={styles.dateTimeRow}>
      <Text style={styles.dateTimeLabel}>Inicio *</Text>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowStartDate(true)}
      >
        <Text>
          {formData.start_time 
            ? formData.start_time.toLocaleDateString() 
            : "Seleccionar fecha"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.timeInput} 
        onPress={() => setShowStartTime(true)}
      >
        <Text>
          {formData.start_time 
            ? formData.start_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
            : "Seleccionar hora"}
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.dateTimeRow}>
      <Text style={styles.dateTimeLabel}>Fin *</Text>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowEndDate(true)}
      >
        <Text>
          {formData.end_time 
            ? formData.end_time.toLocaleDateString() 
            : "Seleccionar fecha"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.timeInput} 
        onPress={() => setShowEndTime(true)}
      >
        <Text>
          {formData.end_time 
            ? formData.end_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
            : "Seleccionar hora"}
        </Text>
      </TouchableOpacity>

      {showStartDate && (
        <DateTimePicker
          value={formData.start_time || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "startDate")}
        />
      )}
      {showStartTime && (
        <DateTimePicker
          value={formData.start_time || new Date()}
          mode="time"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "startTime")}
        />
      )}
      {showEndDate && (
        <DateTimePicker
          value={formData.end_time || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "endDate")}
        />
      )}
      {showEndTime && (
        <DateTimePicker
          value={formData.end_time || new Date()}
          mode="time"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, "endTime")}
        />
      )}
    </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Número máximo de participantes *</Text>
        <TextInput
          style={styles.input}
          value={formData.max_participants}
          onChangeText={(value) => handleChange("max_participants", value)}
          placeholder="Número máximo de participantes"
          keyboardType="numeric"
          maxLength={8}

        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Precio del evento (NO incluye: recursos, alimentacion, etc)</Text>
        <TextInput
          style={styles.input}
          value={formData.price_event}
          onChangeText={(value) => handleChange("price_event", value)}
          placeholder="Precio del evento"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
    </>
  )

  const renderStep3 = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre del lugar *</Text>
        <TextInput
          style={styles.input}
          value={formData.location_name}
          onChangeText={(value) => handleChange("location_name", value)}
          placeholder="Nombre del lugar o establecimiento"
          maxLength={50}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección *</Text>
        <TextInput
          style={styles.input}
          value={formData.location_address}
          onChangeText={(value) => handleChange("location_address", value)}
          placeholder="Dirección completa"
          maxLength={50}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Descripción del lugar</Text>
        <TextInput
          style={styles.textArea}
          value={formData.location_description}
          onChangeText={(value) => handleChange("location_description", value)}
          placeholder="Descripción del lugar (características, instalaciones, etc.)"
          multiline
          numberOfLines={4}
          maxLength={220}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Precio del alquiler</Text>
        <TextInput
          style={styles.input}
          value={formData.location_rental_price}
          onChangeText={(value) => handleChange("location_rental_price", value)}
          placeholder="Precio en COP"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
    </>
  )

  // Mostrar pantalla de carga mientras se obtienen los datos del evento
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.indigo[500]} />
        <Text style={styles.loadingText}>Cargando información del evento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} marginTop={40}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar evento</Text>
      </View>

      <View style={styles.stepsContainer}>
        <View style={[styles.step, currentStep === 1 && styles.activeStep]}>
          <Text style={styles.stepText}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.step, currentStep === 2 && styles.activeStep]}>
          <Text style={styles.stepText}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.step, currentStep === 3 && styles.activeStep]}>
          <Text style={styles.stepText}>3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </View>
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
            <Text style={styles.navigationButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}
        {currentStep < 3 ? (
          <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.navigationButtonText}>Siguiente</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitButtonText}>{loading ? "ACTUALIZANDO EVENTO..." : "ACTUALIZAR EVENTO"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

// Los estilos se mantienen iguales que en el componente original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray[700],
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
    marginTop: 40,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray[300],
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: colors.indigo[500],
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: colors.gray[300],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    backgroundColor: colors.red[100],
    borderWidth: 1,
    borderColor: colors.red[400],
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: colors.red[700],
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imagePickerText: {
    color: colors.gray[500],
  },
  imagePreview: {
    width: "100%",
    height: 128,
    borderRadius: 6,
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    color: colors.gray[700],
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateTimeLabel: {
    width: 50,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
  },
  dateInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  prevButton: {
    backgroundColor: colors.gray[300],
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    marginRight: 11,
  },
  nextButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
   
  },
  submitButton: {
    backgroundColor: colors.indigo[500],
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  navigationButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})