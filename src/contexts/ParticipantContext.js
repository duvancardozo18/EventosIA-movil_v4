"use client";

import { createContext, useState, useContext } from "react";
import { participantService } from "../services/api"; // Asegúrate de tener este servicio creado

const ParticipantContext = createContext();

export const ParticipantProvider = ({ children }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await participantService.getParticipants();
      setParticipants(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener participantes");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipant = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await participantService.getParticipant(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener el participante");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createParticipant = async (participantData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await participantService.createParticipant(participantData);
      setParticipants([...participants, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el participante");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateParticipant = async (id, participantData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await participantService.updateParticipant(id, participantData);
      setParticipants(participants.map(p => (p.id === id ? response.data : p)));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el participante");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateParticipantStatus = async (id, statusId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await participantService.updateParticipantStatus(id, statusId);
      setParticipants(participants.map(p => (p.id === id ? response.data : p)));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el estado");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteParticipant = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await participantService.deleteParticipant(id);
      setParticipants(participants.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el participante");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParticipantContext.Provider
      value={{
        participants,
        loading,
        error,
        fetchParticipants,
        fetchParticipant,
        createParticipant,
        updateParticipant,
        updateParticipantStatus,
        deleteParticipant,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};

export const useParticipant = () => useContext(ParticipantContext);
