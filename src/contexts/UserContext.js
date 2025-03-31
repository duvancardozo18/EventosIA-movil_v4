"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import * as api from "../services/api"
import { useAuth } from "./AuthContext";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token, logout } = useAuth();
  const navigation = useNavigation()

  useEffect(() => {
    if (token) {
      fetchUserProfile()
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();  // Using userService method
      setUser(response.data);
      await AsyncStorage.setItem("user_profile", JSON.stringify(response.data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("No se pudo cargar el perfil del usuario");
      setLoading(false);
  
      // Handle 401 Unauthorized (token expired)
      if (error.response && error.response.status === 401) {
        logout();
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.updateProfile(userData);  // Using userService method
      setUser(response.data);
      await AsyncStorage.setItem("user_profile", JSON.stringify(response.data));
      setLoading(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("No se pudo actualizar el perfil del usuario");
      setLoading(false);
      return { success: false, error: error.response?.data?.message || "Error al actualizar perfil" };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await userService.changePassword(passwordData); // Using the dedicated userService method
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error changing password:", error);
      setError("No se pudo cambiar la contraseña");
      setLoading(false);
      return { success: false, error: error.response?.data?.message || "Error al cambiar contraseña" };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await authService.forgotPassword({ email }); // Using the dedicated authService method
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError("No se pudo solicitar el restablecimiento de contraseña");
      setLoading(false);
      return { success: false, error: error.response?.data?.message || "Error al solicitar restablecimiento" };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await authService.resetPassword({ token, newPassword }); // Use authService method
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "AccountRestored" }],
      });
      return { success: true };
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("No se pudo restablecer la contraseña");
      setLoading(false);
      return { success: false, error: error.response?.data?.message || "Error al restablecer contraseña" };
    }
  };

  const verifyAccount = async (token) => {
    try {
      setLoading(true);
      await authService.verifyAccount({ token }); // Use authService method
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return { success: true };
    } catch (error) {
      console.error("Error verifying account:", error);
      setError("No se pudo verificar la cuenta");
      setLoading(false);
      return { success: false, error: error.response?.data?.message || "Error al verificar cuenta" };
    }
  };

  const resendVerification = async (email) => {
    try {
      setLoading(true);
      await authService.resendVerification({ email }); // Use the authService method
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error resending verification:", error);
      setError("No se pudo reenviar la verificación");
      setLoading(false);
      return { success: false, error: error.response?.data?.message || "Error al reenviar verificación" };
    }
  };
  const deleteAccount = async () => {
    try {
      setLoading(true)
      await userService.deleteProfile() // or whatever the correct method name is
      setLoading(false)
      logout()
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
      return { success: true }
    } catch (error) {
      console.error("Error deleting account:", error)
      setError("No se pudo eliminar la cuenta")
      setLoading(false)
      return { success: false, error: error.response?.data?.message || "Error al eliminar cuenta" }
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
        resendVerification,
        deleteAccount,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

