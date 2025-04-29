// src/contexts/EventTypeContext.js
import { createContext, useState, useContext } from "react";
import { eventTypeService } from "../services/api";

const EventTypeContext = createContext();

export const EventTypeProvider = ({ children }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventTypeService.getEventTypes();
      setEventTypes(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener los tipos de eventos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createEventType = async (eventTypeData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventTypeService.createEventType(eventTypeData);
      setEventTypes([...eventTypes, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el tipo de evento");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Agregar la función para actualizar el tipo de evento
  const updateEventType = async (id, eventTypeData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventTypeService.updateEventType(id, eventTypeData);
      
      // Actualizar el estado con el tipo de evento actualizado
      setEventTypes(eventTypes.map((eventType) =>
        eventType.id === id ? response.data : eventType
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el tipo de evento");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventTypeContext.Provider value={{ eventTypes, loading, error, fetchEventTypes, createEventType, updateEventType }}>
      {children}
    </EventTypeContext.Provider>
  );
};

export const useEventType = () => useContext(EventTypeContext);
