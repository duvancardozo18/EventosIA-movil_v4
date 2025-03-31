"use client"

import { createContext, useState, useContext } from "react"
import { resourceService } from "../services/api"

const ResourceContext = createContext()

export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await resourceService.getResources()
      setResources(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener recursos")
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchResource = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await resourceService.getResource(id)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener el recurso")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (resourceData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await resourceService.createResource(resourceData)
      setResources([...resources, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el recurso")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateResource = async (id, resourceData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await resourceService.updateResource(id, resourceData)
      setResources(resources.map((resource) => (resource.id === id ? response.data : resource)))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el recurso")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteResource = async (id) => {
    try {
      setLoading(true)
      setError(null)
      await resourceService.deleteResource(id)
      setResources(resources.filter((resource) => resource.id !== id))
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el recurso")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResourceContext.Provider
      value={{
        resources,
        loading,
        error,
        fetchResources,
        fetchResource,
        createResource,
        updateResource,
        deleteResource,
      }}
    >
      {children}
    </ResourceContext.Provider>
  )
}

export const useResource = () => useContext(ResourceContext)

