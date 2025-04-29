import { useState, useEffect } from "react";
import { Alert } from 'react-native';
import { useAuth } from "../../../../contexts/AuthContext";
import { useEvent } from "../../../../contexts/EventContext";
import { useEventType } from "../../../../contexts/EventTypeContext";
import { useLocation } from "../../../../contexts/LocationContext";
import { validateStep } from "../utils/formValidation";

export const useEventForm = (navigation) => {
  const { createEvent, loading, error } = useEvent();
  const { createEventType } = useEventType();
  const { createLocation } = useLocation();
  const { user } = useAuth();
  const userId = user?.id_user;
  
  const [currentStep, setCurrentStep] = useState(1);
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
  });
  
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Update user ID when user context is loaded
  useEffect(() => {
    if (user && user.id) {
      setFormData((prev) => ({
        ...prev,
        user_id_created_by: user.id,
      }));
    }
  }, [user]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (selectedDate) {
      if (type === "startDate") {
        const newDate = new Date(selectedDate);
        // Keep existing time if already set
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
        // Keep existing time if already set
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

  const handleImageSelected = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      image: imageData,
    }));
    setImagePreview(imageData.uri);
  };

  const nextStep = () => {
    const validation = validateStep(currentStep, formData);
    if (!validation.isValid) {
      Alert.alert("Campo requerido", validation.message, [{ text: "OK" }]);
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate last step
      const validation = validateStep(currentStep, formData);
      if (!validation.isValid) {
        Alert.alert("Campo requerido", validation.message, [{ text: "OK" }]);
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
  
      // 3. Prepare FormData for event creation
      const eventFormData = new FormData();
      
      // Add fields as strings
      eventFormData.append('name', formData.name);
      eventFormData.append('type_of_event_id', typeEventId);
      eventFormData.append('location_id', locationId);
      eventFormData.append('event_state_id', '1');
      eventFormData.append('user_id_created_by', String(userId));
  
      // Add image if exists
      if (formData.image) {
        eventFormData.append('image', {
          uri: formData.image.uri,
          type: formData.image.mimeType || 'image/jpeg',
          name: formData.image.fileName || `event_${Date.now()}.jpg`
        });
      }
  
      // Send to backend
      const success = await createEvent(eventFormData);
      
      if (success) {
        navigation.navigate("EventCreated");
      } else {
        throw new Error("Error al crear el evento");
      }
    } catch (error) {
      console.error("Error completo:", error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    formData,
    currentStep,
    loading,
    error,
    imagePreview,
    showStartDate,
    showStartTime,
    showEndDate,
    showEndTime,
    setShowStartDate,
    setShowStartTime,
    setShowEndDate,
    setShowEndTime,
    handleChange,
    handleDateChange,
    handleImageSelected,
    nextStep,
    prevStep,
    handleSubmit
  };
};