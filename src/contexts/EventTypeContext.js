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

  return (
    <EventTypeContext.Provider
      value={{
        eventTypes,
        loading,
        error,
        fetchEventTypes,
        createEventType,
      }}
    >
      {children}
    </EventTypeContext.Provider>
  );
};

export const useEventType = () => useContext(EventTypeContext);