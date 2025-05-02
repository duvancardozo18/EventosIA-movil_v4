"use client"

import { createContext, useState, useContext } from "react"
import { billingService } from "../services/api"
import { useAuth } from '../contexts/AuthContext';

const BillingContext = createContext()

export const BillingProvider = ({ children }) => {
  const [billingData, setBillingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useAuth();
  const userId = user?.id;

  const fetchBillingByEventId = async (eventId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await billingService.getBillingByEventId(eventId)
      setBillingData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener la información de facturación")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createBilling = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await billingService.createBilling(data)
      setBillingData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la información de facturación")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateBilling = async (billingId, data) => {
    try {
      setLoading(true)
      setError(null)
      const response = await billingService.updateBilling(billingId, data)
      setBillingData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la información de facturación")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteBilling = async (billingId) => {
    try {
      setLoading(true)
      setError(null)
      await billingService.deleteBilling(billingId)
      setBillingData(null)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la información de facturación")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <BillingContext.Provider
      value={{
        billingData,
        loading,
        error,
        fetchBillingByEventId,
        createBilling,
        updateBilling,
        deleteBilling
      }}
    >
      {children}
    </BillingContext.Provider>
  )
}

export const useBilling = () => useContext(BillingContext)
