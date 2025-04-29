// EventFormProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useEvent } from "../../../../../contexts/EventContext";
import { useEventType } from "../../../../../contexts/EventTypeContext";
import { useLocation } from "../../../../../contexts/LocationContext";

const EventFormContext = createContext();

export const useEventForm = () => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error("useEventForm must be used within an EventFormProvider");
  }
  return context;
};

export const EventFormProvider = ({ children, initialData = null }) => {
  const { createEvent, updateEvent, loading, error } = useEvent();
  const { createEventType, updateEventType } = useEventType();
  const { createLocation, updateLocation } = useLocation();
  const { user } = useAuth();
  const userId = user?.id_user;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  
  // Default form state
  const defaultFormData = {
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
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);

  // Update user ID if it becomes available
  useEffect(() => {
    if (user && user.id) {
      setFormData((prev) => ({
        ...prev,
        user_id_created_by: user.id,
      }));
    }
  }, [user]);

  // Handle form field changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date/time changes
  const handleDateChange = (event, selectedDate, type) => {
    if (selectedDate) {
      if (type === "startDate") {
        const newDate = new Date(selectedDate);
        // Keep the existing time if available
        if (formData.start_time) {
          newDate.setHours(formData.start_time.getHours(), formData.start_time.getMinutes());
        }
  
        setFormData((prev) => ({
          ...prev,
          start_time: newDate,
        }));
        setShowStartDate(false);
      } else if (type === "startTime") {
        const newDate = formData.start_time ? new Date(formData.start_time) : new Date();
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
  
        setFormData((prev) => ({
          ...prev,
          start_time: newDate,
        }));
        setShowStartTime(false);
      } else if (type === "endDate") {
        const newDate = new Date(selectedDate);
        // Keep the existing time if available
        if (formData.end_time) {
          newDate.setHours(formData.end_time.getHours(), formData.end_time.getMinutes());
        }
  
        setFormData((prev) => ({
          ...prev,
          end_time: newDate,
        }));
        setShowEndDate(false);
      } else if (type === "endTime") {
        const newDate = formData.end_time ? new Date(formData.end_time) : new Date();
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
  
        setFormData((prev) => ({
          ...prev,
          end_time: newDate,
        }));
        setShowEndTime(false);
      }
    } else {
      if (type === "startDate") setShowStartDate(false);
      if (type === "startTime") setShowStartTime(false);
      if (type === "endDate") setShowEndDate(false);
      if (type === "endTime") setShowEndTime(false);
    }
  };

  // Validation for step transitions
  const validateStep = (step) => {
    if (step === 1 && !formData.name) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese el nombre del evento",
        [{ text: "OK" }]
      );
      return false;
    }
  
    if (step === 2 && !formData.event_modality) {
      Alert.alert(
        "Campo requerido",
        "Por favor seleccione el tipo de evento",
        [{ text: "OK" }]
      );
      return false;
    }

    if (step === 2 && (!formData.start_time || !formData.end_time)) {
      Alert.alert(
        "Campo requerido",
        "Por favor ingrese la fecha y hora del evento",
        [{ text: "OK" }]
      );
      return false;
    }
    
    return true;
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit form
  const handleSubmit = async (navigation) => {
    try {
      // Final validation before submission
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
  
      // 1. Create event type
      const typeEventResponse = await createEventType({
        name: formData.name,
        description: formData.description || "",
        event_type: formData.event_modality || "",
        start_time: formData.start_time || "",
        end_time: formData.end_time || "",
        video_conference_link: formData.video_conference_link || "",
        price: formData.price_event || "",
        max_participants: formData.max_participants || 0
      });
  
      if (!typeEventResponse?.id_type_of_event) {
        throw new Error("No se recibió el ID del tipo de evento");
      }
  
      const typeEventId = typeEventResponse.id_type_of_event;
      console.log("Tipo de evento creado con ID:", typeEventId);

      // 2. Create location
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
  
      // 3. Prepare FormData
      const eventFormData = new FormData();
      
      // 4. Add fields as strings
      eventFormData.append('name', formData.name);
      eventFormData.append('type_of_event_id', typeEventId);
      eventFormData.append('location_id', locationId);
      eventFormData.append('event_state_id', '1');
      eventFormData.append('user_id_created_by', String(userId));
  
      // 5. Add image if available
      if (formData.image) {
        eventFormData.append('image', {
          uri: formData.image.uri,
          type: formData.image.mimeType || 'image/jpeg',
          name: formData.image.fileName || `event_${Date.now()}.jpg`
        });
      }
  
      // 6. Send to backend
      const success = await createEvent(eventFormData);
      
      if (success) {
        navigation.navigate("EventCreated");
      } else {
        throw new Error("Error al crear el evento");
      }
    } catch (error) {
      console.error("Error completo:", error);
      Alert.alert("Error", `${error.message}`);
    }
  };

  // Update image preview
  const updateImagePreview = (uri) => {
    setImagePreview(uri);
  };

  // Reset form
  const resetForm = () => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setImagePreview(null);
  };

  // Provider value
  const value = {
    formData,
    currentStep,
    imagePreview,
    loading,
    error,
    showStartDate,
    showStartTime,
    showEndDate,
    showEndTime,
    handleChange,
    handleDateChange,
    nextStep,
    prevStep,
    handleSubmit,
    setShowStartDate,
    setShowStartTime,
    setShowEndDate,
    setShowEndTime,
    updateImagePreview,
    resetForm,
    isEditMode: !!initialData
  };

  return (
    <EventFormContext.Provider value={value}>
      {children}
    </EventFormContext.Provider>
  );
};

export default EventFormProvider;