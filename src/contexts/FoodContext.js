"use client"

import { createContext, useState, useContext } from "react"
import { foodService } from "../services/api"

const FoodContext = createContext()

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFoods = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await foodService.getFoods()
      setFoods(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener alimentos")
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchFood = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await foodService.getFood(id)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener el alimento")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createFood = async (foodData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await foodService.createFood(foodData)
      setFoods([...foods, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el alimento")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateFood = async (id, foodData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await foodService.updateFood(id, foodData)
      setFoods(foods.map((food) => (food.id === id ? response.data : food)))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el alimento")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteFood = async (id) => {
    try {
      setLoading(true)
      setError(null)
      await foodService.deleteFood(id)
      setFoods(foods.filter((food) => food.id !== id))
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el alimento")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <FoodContext.Provider
      value={{
        foods,
        loading,
        error,
        fetchFoods,
        fetchFood,
        createFood,
        updateFood,
        deleteFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  )
}

export const useFood = () => useContext(FoodContext)

