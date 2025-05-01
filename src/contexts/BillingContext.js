// BillingContext.js - Versión mejorada
import React, { createContext, useState, useCallback } from 'react';
import { billingService } from '../services/api';

const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Limpiar cualquier error previo
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Limpiar los datos de facturación
  const clearBillingData = useCallback(() => {
    setBillingData(null);
  }, []);

  // Obtener los detalles de la factura
  const fetchBillingData = useCallback(async (eventId) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await billingService.getBilling(eventId);
      setBillingData(response.data);  // Almacena los datos de facturación
      return response.data;
    } catch (err) {
      console.error('Error al obtener factura:', err);
      setError(err.response?.data?.mensaje || 'No se pudo obtener la factura');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva factura
  const createBilling = useCallback(async (eventId, paymentMethod) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await billingService.createBilling(eventId, paymentMethod);
      // Asumimos que la respuesta contiene la nueva factura en response.data o response.data.billing
      const newBillingData = response.data.billing || response.data;
      setBillingData(newBillingData);
      return newBillingData;
    } catch (err) {
      console.error('Error al crear factura:', err);
      setError(err.response?.data?.mensaje || 'No se pudo crear la factura');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aceptar la factura
  const acceptBilling = useCallback(async (billingId) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await billingService.acceptBilling(billingId);
      // Actualizamos el estado con la factura aceptada
      const updatedBilling = response.data.billing || response.data;
      setBillingData(prevData => ({
        ...prevData,
        estado: updatedBilling.estado || 'Aceptada'
      }));
      return updatedBilling;
    } catch (err) {
      console.error('Error al aceptar factura:', err);
      setError(err.response?.data?.mensaje || 'No se pudo aceptar la factura');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rechazar la factura
  const rejectBilling = useCallback(async (billingId) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await billingService.rejectBilling(billingId);
      // Actualizamos el estado con la factura rechazada
      const updatedBilling = response.data.billing || response.data;
      setBillingData(prevData => ({
        ...prevData,
        estado: updatedBilling.estado || 'Rechazada'
      }));
      return updatedBilling;
    } catch (err) {
      console.error('Error al rechazar factura:', err);
      setError(err.response?.data?.mensaje || 'No se pudo rechazar la factura');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular totales (helper function)
  const calculateTotals = useCallback((billingData) => {
    if (!billingData || !billingData.costos) return 0;
    
    return billingData.costos.total || 
      (billingData.costos.logistica + 
       billingData.costos.alquiler_sitio + 
       billingData.costos.alimentacion + 
       billingData.costos.recursos);
  }, []);

  // Verificar si hay factura activa
  const hasBilling = useCallback(() => {
    return billingData !== null && billingData.estado !== 'Sin cotización';
  }, [billingData]);

  // Obtener datos formateados para mostrar
  const getFormattedBillingData = useCallback(() => {
    if (!billingData) return null;
    
    return {
      cliente: billingData.cliente,
      estado: billingData.estado,
      costos: billingData.costos,
      total: calculateTotals(billingData),
      // Puedes añadir más campos formateados según necesites
    };
  }, [billingData, calculateTotals]);

  return (
    <BillingContext.Provider value={{
      billingData,
      loading,
      error,
      fetchBillingData,
      createBilling,
      acceptBilling,
      rejectBilling,
      clearError,
      clearBillingData,
      hasBilling,
      getFormattedBillingData
    }}>
      {children}
    </BillingContext.Provider>
  );
};

export default BillingContext;