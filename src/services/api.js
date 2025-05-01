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
      }
      
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
  getUser: async (email) => {
    try {
      const response = await api.get(`/users/${email}`)
      if (response.status === 200 && response.data.usuario) {
        return response.data
      }
      return null
    } catch (error) {
      // Si el error es 404 (usuario no encontrado), simplemente devolver null
      if (error.response && error.response.status === 404) {
        return null
      }
      // Si es otro error (problema de servidor, etc.), sí mostrar error
      console.error("Error obteniendo usuario:", error)
      return null
    }
  },
  createUser: (userData) => api.post("/users", userData),
  updateUser: (id, userData) => api.put(`/users/${id}/rol`, userData),
  deleteUser: (email) => api.delete("/delete-user", { data: { email } }),
  sendCredentials: (invitationData) => api.post("/credentials", invitationData),
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
    updateEventStatus: (eventId, body) => {
      return api.put(`/events/${eventId}/status`, body);
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
  getParticipant: (id) => api.get(`/participants/${id}`),
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

// Servicios de categorías
export const categoryService = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
}

export const invitationService = {
  sendInvitation: (invitationData) => api.post("invitacion", invitationData),
}

// Servicios de facturación
export const billingService = {
  // Obtener la cotización o factura de un evento (GET /billing/:eventId)
  getBilling: (eventId) => api.get(`/billing/${eventId}`),

  // Crear una nueva factura (POST /billing)
  createBilling: (eventId, paymentMethod) => api.post('/billing', { event_id: eventId, payment_method: paymentMethod }),

  // Aceptar la cotización (GET /billing/accept/:billingId)
  acceptBilling: (billingId) => api.get(`/billing/accept/${billingId}`),

  // Rechazar la cotización (GET /billing/reject/:billingId)
  rejectBilling: (billingId) => api.get(`/billing/reject/${billingId}`)
};

export default api

