"use client"

import { createContext, useState, useContext } from "react"
import { eventService, foodService, resourceService, participantService } from "../services/api"
import { useAuth } from '../contexts/AuthContext';  


const EventContext = createContext()




export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [currentEvent, setCurrentEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Obtener el ID del usuario desde el contexto de autenticación
  const { user } = useAuth();
  const userId = user?.id; 

  // Eventos
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventService.getEvents()
      setEvents(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener eventos")
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchEvent = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventService.getEvent(id)
      setCurrentEvent(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener el evento")
      return null
    } finally {
      setLoading(false)
    }
  }


  const fetchEventByIdForUserId = async (userId) => {
    try {
      console.log("Iniciando fetchEventByIdForUserId con userId:", userId);
      setLoading(true);
      setError(null);
      const response = await eventService.getEventByIdForUserId(userId);
      console.log("Respuesta del backend:", response.data);
      setEvents(response.data);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        setEvents([]);
        setError("No hay eventos registrados para este usuario.");
      } else {
        setError("Error al cargar los eventos.");
      }
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  const createEvent = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.createEvent(formData);
      
      if (response.status === 201) {
        setEvents(prev => [...prev, response.data]);
        return response.data;
      }
      
      throw new Error(`Respuesta inesperada: ${response.status}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      console.error("Error en creación de evento:", {
        status: err.response?.status,
        data: err.response?.data
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventService.updateEvent(id, eventData)
      setEvents(events.map((event) => (event.id === id ? response.data : event)))
      if (currentEvent && currentEvent.id === id) {
        setCurrentEvent(response.data)
      }
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el evento")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id) => {
    try {
      setLoading(true)
      setError(null)
      await eventService.deleteEvent(id)
      setEvents(events.filter((event) => event.id !== id))
      if (currentEvent && currentEvent.id === id) {
        setCurrentEvent(null)
      }
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el evento")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Alimentos del evento
  const fetchEventFoods = async (eventId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await foodService.getEventFoods(eventId)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener los alimentos del evento")
      return []
    } finally {
      setLoading(false)
    }
  }

  const assignFoodToEvent = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await foodService.assignFoodToEvent(data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al asignar alimento al evento")
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeFoodFromEvent = async (eventId, foodId) => {
    try {
      setLoading(true)
      setError(null)
      await foodService.removeFoodFromEvent(eventId, foodId)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar alimento del evento")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Recursos del evento
  const fetchEventResources = async (eventId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await resourceService.getEventResources(eventId)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener los recursos del evento")
      return []
    } finally {
      setLoading(false)
    }
  }

  const assignResourceToEvent = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await resourceService.assignResourceToEvent(data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al asignar recurso al evento")
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeResourceFromEvent = async (eventId, resourceId) => {
    try {
      setLoading(true)
      setError(null)
      await resourceService.removeResourceFromEvent(eventId, resourceId)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar recurso del evento")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Participantes del evento
  const fetchEventParticipants = async (eventId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await participantService.getEventParticipants(eventId)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener los participantes del evento")
      return []
    } finally {
      setLoading(false)
    }
  }

  const registerParticipant = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await participantService.registerParticipant(data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar participante")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateParticipant = async (userId, data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await participantService.updateParticipant(userId, data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar participante")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteParticipant = async (userId, data) => {
    try {
      setLoading(true)
      setError(null)
      await participantService.deleteParticipant(userId, data)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar participante")
      return false
    } finally {
      setLoading(false)
    }
  }


  const updateEventStatus = async (id, eventStateId) => {
    try {
      setLoading(true)
      setError(null)
  
      // Llamada al servicio para actualizar el estado del evento
      const response = await eventService.updateEventStatus(id, { event_state_id: eventStateId })
      
      // Actualizar el estado de los eventos en el contexto
      setEvents(events.map((event) => (event.id === id ? { ...event, event_state_id: eventStateId } : event)))
      
      // Si el evento actual es el que se está actualizando, actualizar el estado también
      if (currentEvent && currentEvent.id === id) {
        setCurrentEvent({ ...currentEvent, event_state_id: eventStateId })
      }
  
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el estado del evento")
      return null
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <EventContext.Provider
      value={{
        events,
        currentEvent,
        loading,
        error,
        fetchEvents,
        fetchEvent,
        fetchEventByIdForUserId,
        createEvent,
        updateEvent,
        deleteEvent,
        fetchEventFoods,
        assignFoodToEvent,
        removeFoodFromEvent,
        fetchEventResources,
        assignResourceToEvent,
        removeResourceFromEvent,
        fetchEventParticipants,
        registerParticipant,
        updateParticipant,
        deleteParticipant,
        updateEventStatus,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export const useEvent = () => useContext(EventContext)

