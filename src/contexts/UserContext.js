"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { userService, authService } from "../services/api"
import { useAuth } from "./AuthContext"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { logout } = useAuth()
  const navigation = useNavigation()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const email = await AsyncStorage.getItem("lastEmail")
      if (!email) throw new Error("No se encontró el email del usuario")

      const response = await userService.getUser(email)
      setUser(response.data.usuario)
      await AsyncStorage.setItem("user_profile", JSON.stringify(response.data.usuario))
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setError("No se pudo cargar el perfil del usuario")
      if (error.response && error.response.status === 401) {
        logout()
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (userData) => {
    try {
      setLoading(true)
      const response = await userService.updateProfile(userData)
      setUser(response.data)
      await AsyncStorage.setItem("user_profile", JSON.stringify(response.data))
      return { success: true, data: response.data }
    } catch (error) {
      console.error("Error updating user profile:", error)
      setError("No se pudo actualizar el perfil del usuario")
      return { success: false, error: error.response?.data?.message || "Error al actualizar perfil" }
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (passwordData) => {
    try {
      setLoading(true)
      await userService.changePassword(passwordData)
      return { success: true }
    } catch (error) {
      console.error("Error changing password:", error)
      setError("No se pudo cambiar la contraseña")
      return { success: false, error: error.response?.data?.message || "Error al cambiar contraseña" }
    } finally {
      setLoading(false)
    }
  }

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true)
      await authService.requestPasswordReset(email)
      return { success: true }
    } catch (error) {
      console.error("Error requesting password reset:", error)
      setError("No se pudo solicitar el restablecimiento de contraseña")
      return { success: false, error: error.response?.data?.message || "Error al solicitar restablecimiento" }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true)
      await authService.resetPassword({ token, newPassword })
      navigation.reset({
        index: 0,
        routes: [{ name: "AccountRestored" }],
      })
      return { success: true }
    } catch (error) {
      console.error("Error resetting password:", error)
      setError("No se pudo restablecer la contraseña")
      return { success: false, error: error.response?.data?.message || "Error al restablecer contraseña" }
    } finally {
      setLoading(false)
    }
  }

  const verifyAccount = async (token) => {
    try {
      setLoading(true)
      await authService.verifyEmail(token)
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
      return { success: true }
    } catch (error) {
      console.error("Error verifying account:", error)
      setError("No se pudo verificar la cuenta")
      return { success: false, error: error.response?.data?.message || "Error al verificar cuenta" }
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setLoading(true)
      await userService.deleteUser() // suponiendo que existe
      logout()
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
      return { success: true }
    } catch (error) {
      console.error("Error deleting account:", error)
      setError("No se pudo eliminar la cuenta")
      return { success: false, error: error.response?.data?.message || "Error al eliminar cuenta" }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUserProfile,
        updateUserProfile,
        changePassword,
        requestPasswordReset,
        resetPassword,
        verifyAccount,
        deleteAccount,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)