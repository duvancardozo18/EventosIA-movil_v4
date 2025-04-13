"use client"

import { createContext, useState, useContext } from "react"
import { locationService } from "../services/api"

const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationServiceService.getLocations();
      setLocations(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener ubicaciones");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchLocation = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.getLocation(id);  // Using resourceService
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener la ubicación");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.createLocation(locationData); // Using resourceService
      setLocations([...locations, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la ubicación");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (id, locationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.updateLocation(id, locationData);
      setLocations(locations.map(location => 
        location.id === id ? response.data : location
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la ubicación");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id) => {
    try {
      setLoading(true);
      setError(null);
      // Use the appropriate service from your available options
      await locationService.deleteLocation(id); // or eventService.deleteLocation(id)
      setLocations(locations.filter((location) => location.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la ubicación");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        loading,
        error,
        fetchLocations,
        fetchLocation,
        createLocation,
        updateLocation,
        deleteLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => useContext(LocationContext)

