"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authService } from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar si hay un token almacenado
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const userData = await AsyncStorage.getItem("user")

        if (token && userData) {
          setUser(JSON.parse(userData))
        }
      } catch (e) {
        console.error("Error loading user data:", e)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.login({ email, password })

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token)
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user))
        setUser(response.data.user)
        return true
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (e) {
      console.error("Error during logout:", e)
    }
  }

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true)
      setError(null)
      await authService.requestPasswordReset(email)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al solicitar restablecimiento de contraseña")
      return false
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true)
      setError(null)
      await authService.resetPassword({ token, newPassword })
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

