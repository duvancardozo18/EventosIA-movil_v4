
"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
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
import { Alert } from 'react-native';


export default function CreateEventScreen() {
  const navigation = useNavigation()
  const { createEvent, loading, error } = useEvent()
  const { createEventType} = useEventType()
  const { createLocation } = useLocation()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const userId = user?.id_user
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    event_state_id: 1,
    event_modality: "",
    user_id_created_by: userId || "",
    image: null,
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
  const [loadingEventTypes, setLoadingEventTypes] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [showStartDate, setShowStartDate] = useState(false)
  const [showStartTime, setShowStartTime] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)

  const { categories, getCategories } = useCategory()

  useEffect(() => {
    const loadData = async () => {
      if (user && user.id) {
        setFormData((prev) => ({
          ...prev,
          user_id_created_by: user.id,
        }))
      }
      // Cargar categorías
      await getCategories()
    }

    loadData()
  }, [user])

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


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
      }))
      setImagePreview(selectedImage.uri)
    }
  }

  const handleDateChange = (event, selectedDate, type) => {
    if (selectedDate) {
      if (type === "startDate") {
        const newDate = new Date(selectedDate)
        // Si ya hay una hora seleccionada, mantenerla
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
        // Si ya hay una hora seleccionada, mantenerla
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

  const handleSubmit = async () => {
    try {
      if (!formData.location_name) {
        Alert.alert(
          "Campo requerido",
          "Por favor ingrese el nombre del lugar",
          [{ text: "OK" }]
        );
        return;
      }

      if (!formData.location_address) {
        Alert.alert(
          "Campo requerido",
          "Por favor ingrese la dirección del lugar",
          [{ text: "OK" }]
        );
        return;
      }

      if (!formData.start_time || !formData.end_time) {
        Alert.alert(
          "Campo requerido",
          "Por favor ingrese la fecha y hora del evento",
          [{ text: "OK" }]
        );
        return;
      }


      console.log("Datos iniciales del formulario:", formData);

      // Convertir fechas al formato local (YYYY-MM-DD HH:mm:ss)
      const formatDateToLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = "00";
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const formattedStartTime = formatDateToLocal(formData.start_time);
      const formattedEndTime = formatDateToLocal(formData.end_time);

    console.log("Fechas formateadas (local):", formattedStartTime, formattedEndTime);
  
      // 1. Crear tipo de evento
      const typeEventResponse = await createEventType({
        name: formData.name,
        description: formData.description || "",
        event_type: formData.event_modality || "",
        start_time: formattedStartTime, // Usar formato local
        end_time: formattedEndTime,    // Usar formato local
        video_conference_link: formData.video_conference_link || "",
        price: formData.price_event || "",
        category_id: formData.categories_id || "",
        max_participants: formData.max_participants || 0
      });
  
      if (!typeEventResponse?.id_type_of_event) {
        throw new Error("No se recibió el ID del tipo de evento");
      }
  
      const typeEventId = typeEventResponse.id_type_of_event;
      console.log("Tipo de evento creado con ID:", typeEventId);


      // 2. Crear la ubicación
      const locationResponse = await createLocation({
        name: formData.location_name,
        address: formData.location_address,
        description: formData.location_description || "",
        price: formData.location_rental_price || 0
      });
  
      if (!locationResponse?.id_location) {
        throw new Error("No se recibió el ID de la ubicación");
      }
  
      const locationId = locationResponse.id_location;
      console.log("Ubicación creada con ID:", locationId);
  
      // 2. Preparar FormData
      const eventFormData = new FormData();
      
      // 3. Agregar campos como strings (importante)
      eventFormData.append('name', formData.name);
      eventFormData.append('type_of_event_id', typeEventId);
      eventFormData.append('location_id', locationId);
      eventFormData.append('event_state_id', '1'); // Valor por defecto
      eventFormData.append('user_id_created_by', String(userId));
  
      // 4. Agregar imagen si existe
      if (formData.image) {
        eventFormData.append('image', {
          uri: formData.image.uri,
          type: formData.image.mimeType || 'image/jpeg',
          name: formData.image.fileName || `event_${Date.now()}.jpg`
        });
      }
  
  
      // 6. Enviar al backend
      const success = await createEvent(eventFormData);
      
      if (success) {
        navigation.navigate("EventCreated");
      } else {
        throw new Error("Error al crear el evento");
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
        <Text style={styles.label}>Nombre del evento <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          placeholder="Nombre del evento"
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
        />
      </View>

      <View style={styles.formGroup}>
      <Text style={styles.label}>Categoria <Text style={{ color: 'red' }}>*</Text></Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.categories_id}
            onValueChange={(value) => handleChange("categories_id", value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar categoría" value={null} />
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
            {formData.image ? formData.image.fileName || "Imagen seleccionada" : "Seleccionar imagen"}
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
        <Text style={styles.label}>Tipo de evento <Text style={{ color: 'red' }}>*</Text></Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={formData.event_modality}
                onValueChange={(value) => handleChange("event_modality", value)}
                style={styles.picker}
            >
                <Picker.Item label="Seleccionar tipo de evento" value="" />
                <Picker.Item label="Virtual" value="Virtual" />
                <Picker.Item label="Presencial" value="Presencial" />
                <Picker.Item label="Híbrido" value="Hibrido" />
            </Picker>
        </View>
    </View>

    {(formData.event_modality === 'Virtual' || formData.event_modality === 'Hibrido') && (
        <View style={styles.formGroup}>
            <Text style={styles.label}>Enlace del meet</Text>
            <TextInput
              style={styles.input}
              value={formData.video_conference_link}
              onChangeText={(value) => handleChange("video_conference_link", value)}
              placeholder="Enlace de videoconferencia"
            />
        </View>
    )}


    <View style={styles.dateTimeRow}>
      <Text style={styles.dateTimeLabel}>Inicio <Text style={{ color: 'red' }}>*</Text></Text>
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
      <Text style={styles.dateTimeLabel}>Fin <Text style={{ color: 'red' }}>*</Text></Text>
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

       {/* DateTimePicker modificados - VAN JUSTO AQUÍ */}
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
        <Text style={styles.label}>Número máximo de participantes <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.max_participants}
          onChangeText={(value) => handleChange("max_participants", value)}
          placeholder="Número máximo de participantes"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Precio del evento <Text style={{ color: 'red' }}>*</Text> (NO incluye: recursos, alimentación, etc)
        </Text>
        <TextInput
          style={styles.input}
          value={formData.price_event}
          onChangeText={(value) => handleChange("price_event", value)}
          placeholder="Precio del evento"
          keyboardType="numeric"
        />
      </View>

    </>
  )

  const renderStep3 = () => (
    <>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre del lugar <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.location_name}
          onChangeText={(value) => handleChange("location_name", value)}
          placeholder="Nombre del lugar o establecimiento"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dirección <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={formData.location_address}
          onChangeText={(value) => handleChange("location_address", value)}
          placeholder="Dirección completa"
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
        />
      </View>

    </>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="arrow-left" size={24} color={colors.gray[800]} marginTop={40}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear evento</Text>
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
            <Text style={styles.submitButtonText}>{loading ? "CREANDO EVENTO..." : "CREAR EVENTO"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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