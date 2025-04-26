import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_BASE_URL } from '@env'

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Accept": "application/json", // Cambiado de Content-Type
  },
  withCredentials: true,  // ⚠️ Comenta o elimina esta línea
});

// Interceptor mejorado
  api.interceptors.request.use(async (config) => {
    // Debug de la petición
      console.log(`Preparando petición a ${config.url}`);
      
      // Agregar token solo si existe
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token JWT agregado a los headers");
      }
      
      // Debug final de los headers
      console.log("Headers finales:", config.headers);
      
      return config;
    }, (error) => {
      console.error("Error en interceptor:", error);
      return Promise.reject(error);
  });

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post("/login", credentials),
  requestPasswordReset: (email) => api.post("/request-password-reset", { email }),
  resetPassword: (data) => api.post("/reset-password", data),
  verifyEmail: (token) => api.post(`/verify-email/${token}`),
  getCurrentUser: async () => {
    const email = await AsyncStorage.getItem("lastEmail")
    if (!email) throw new Error("No hay email almacenado")
    return api.get(`/users/${email}`)
  }  
}

// Servicios de usuarios
export const userService = {
  getUsers: () => api.get("/users"),
  getUser: (email) => api.get(`/users/${email}`),
  createUser: (userData) => api.post("/users", userData),
  updateUser: (id, userData) => api.put(`/users/${id}/rol`, userData),
  deleteUser: (email) => api.delete("/delete-user", { data: { email } }),
}

// Servicios de eventos
  export const eventService = {
    getEvents: () => api.get("/events"),
    getEvent: (id) => api.get(`/events/${id}`),
    updateEvent: (id, formData) => {
      return api.put(`/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    },
    deleteEvent: (id) => api.delete(`/events/${id}`),
    createEvent: (formData) => {
    // Crear FormData para manejar la imagen y otros campos
    const formDataToSend = new FormData();
    
    // Agrega todos los campos al FormData
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        formDataToSend.append('image', {
          uri: formData.image.uri,
          type: formData.image.mimeType,
          name: formData.image.fileName || 'event_image.jpg'
        });
      } else if (key === 'start_time' || key === 'end_time') {
        formDataToSend.append(key, formData[key].toISOString());
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });
    
      return api.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        transformRequest: (data) => data
      });
    },
  };

// Servicios de comida
export const foodService = {
  getFoods: () => api.get("/food"),
  getFood: (id) => api.get(`/food/${id}`),
  createFood: (foodData) => api.post("/food", foodData),
  updateFood: (id, foodData) => api.put(`/food/${id}`, foodData),
  deleteFood: (id) => api.delete(`/food/${id}`),
  assignFoodToEvent: (data) => api.post("/events/food", data),
  getEventFoods: (eventId) => api.get(`/events/${eventId}/food`),
  removeFoodFromEvent: (eventId, foodId) => api.delete(`/events/${eventId}/food/${foodId}`),
}

// Servicios de recursos
export const resourceService = {
  getResources: () => api.get("/resources"),
  getResource: (id) => api.get(`/resources/${id}`),
  createResource: (resourceData) => api.post("/resources", resourceData),
  updateResource: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  assignResourceToEvent: (data) => api.post("/event-resources", data),
  getEventResources: (eventId) => api.get(`/events/${eventId}/resources`),
  removeResourceFromEvent: (eventId, resourceId) => api.delete(`/events/${eventId}/resources/${resourceId}`),
}

// Servicios de participantes
export const participantService = {
  getParticipants: () => api.get("/participants/list"),
  getEventParticipants: (eventId) => api.get(`/participants/event/${eventId}`),
  registerParticipant: (data) => api.post("/participants/register", data),
  updateParticipant: (userId, data) => api.put(`/participants/update/${userId}`, data),
  deleteParticipant: (userId, data) => api.delete(`/participants/delete/${userId}`, { data }),
}

// Servicios de tipos de evento
export const eventTypeService = {
  getEventTypes: () => api.get("/types-of-event"),
  getEventType: (id) => api.get(`/types-of-event/${id}`),
  createEventType: (data) => api.post("/types-of-event", data),
  updateEventType: (id, data) => api.put(`/types-of-event/${id}`, data),
  // deleteEventType: (id) => api.delete(`/types-of-event/${id}`), // opcional
}

// Servicios de ubicaciones
export const locationService = {
  getLocations: () => api.get("/locations"),
  getLocation: (id) => api.get(`/locations/${id}`),
  createLocation: (data) => api.post("/locations", data),
  updateLocation: (id, data) => api.put(`/locations/${id}`, data),
  // deleteLocation: (id) => api.delete(`/locations/${id}`), // opcional
}

export const categoryService = {
  getCategories: () => api.get("/categories"),
}

export default api

