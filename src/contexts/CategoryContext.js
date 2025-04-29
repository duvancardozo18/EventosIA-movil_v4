"use client"

import { createContext, useState, useContext } from "react"
import { categoryService } from "../services/api"

const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryService.getCategories()
      setCategories(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener las categorías")
      return []
    } finally {
      setLoading(false)
    }
  }

  const getCategory = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryService.getCategory(id)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener la categoría")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryService.createCategory(categoryData)
      setCategories([...categories, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la categoría")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoryService.updateCategory(id, categoryData)
      setCategories(categories.map(category => 
        category.id_category === id ? response.data : category
      ))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la categoría")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id) => {
    try {
      setLoading(true)
      setError(null)
      await categoryService.deleteCategory(id)
      setCategories(categories.filter((category) => category.id_category !== id))
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar la categoría")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        getCategories,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategory = () => useContext(CategoryContext)