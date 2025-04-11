"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authService } from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ⏳ Verificar sesión activa desde cookie + email al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await authService.getCurrentUser()
        setUser(res.data.usuario)
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  // ✅ Login que guarda cookie Y email
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.login({ email, password })

      if (response.data?.usuario) {
        await AsyncStorage.setItem("lastEmail", response.data.usuario.email)
        setUser(response.data.usuario)
        return true
      }

      return false
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión")
      return false
    } finally {
      setLoading(false)
    }
  }

  // ✅ Logout que limpia estado y storage
  const logout = async () => {
    try {
      await authService.logout()
      await AsyncStorage.removeItem("lastEmail")
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
      setError(err.response?.data?.error || "Error al solicitar restablecimiento de contraseña")
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
      setError(err.response?.data?.error || "Error al restablecer la contraseña")
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)