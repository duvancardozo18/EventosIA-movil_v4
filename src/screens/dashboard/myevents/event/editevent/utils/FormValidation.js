/**
 * Validates the form data for the current step.
 * @param {number} step - The current step number
 * @param {object} formData - The form data object
 * @returns {object} - Object with isValid boolean and message string
 */
export const validateStep = (step, formData) => {
    switch (step) {
      case 1: // Basic info step
        if (!formData.name || formData.name.trim() === '') {
          return {
            isValid: false,
            message: "Por favor ingrese el nombre del evento"
          };
        }
        break;
        
      case 2: // Event details step
        if (!formData.event_modality) {
          return {
            isValid: false,
            message: "Por favor seleccione el tipo de evento"
          };
        }
        
        if (!formData.start_time || !formData.end_time) {
          return {
            isValid: false,
            message: "Por favor ingrese la fecha y hora del evento"
          };
        }
        
        // Check if end time is after start time
        if (formData.start_time && formData.end_time && 
            formData.end_time <= formData.start_time) {
          return {
            isValid: false,
            message: "La hora de finalización debe ser posterior a la hora de inicio"
          };
        }
        break;
        
      case 3: // Location step
        if (!formData.location_name || formData.location_name.trim() === '') {
          return {
            isValid: false,
            message: "Por favor ingrese el nombre del lugar"
          };
        }
        
        if (!formData.location_address || formData.location_address.trim() === '') {
          return {
            isValid: false,
            message: "Por favor ingrese la dirección del lugar"
          };
        }
        break;
        
      default:
        return { isValid: true };
    }
    
    return { isValid: true };
  };
  
  /**
   * Validates numeric input, allowing only positive numbers
   * @param {string} value - The input value to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  export const validateNumericInput = (value) => {
    if (!value) return true; // Empty is valid (not required)
    
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= 0;
  };
  
  /**
   * Validates the complete form before submission
   * @param {object} formData - The complete form data
   * @returns {object} - Object with isValid boolean and message string
   */
  export const validateCompleteForm = (formData) => {
    // Required fields validation
    if (!formData.name || formData.name.trim() === '') {
      return {
        isValid: false,
        message: "Por favor ingrese el nombre del evento"
      };
    }
    
    if (!formData.event_modality) {
      return {
        isValid: false,
        message: "Por favor seleccione el tipo de evento"
      };
    }
    
    if (!formData.start_time || !formData.end_time) {
      return {
        isValid: false,
        message: "Por favor ingrese la fecha y hora del evento"
      };
    }
    
    if (!formData.location_name || formData.location_name.trim() === '') {
      return {
        isValid: false,
        message: "Por favor ingrese el nombre del lugar"
      };
    }
    
    if (!formData.location_address || formData.location_address.trim() === '') {
      return {
        isValid: false,
        message: "Por favor ingrese la dirección del lugar"
      };
    }
    
    // Validate date logic
    if (formData.end_time <= formData.start_time) {
      return {
        isValid: false,
        message: "La hora de finalización debe ser posterior a la hora de inicio"
      };
    }
    
    // Everything is valid
    return { isValid: true };
  };