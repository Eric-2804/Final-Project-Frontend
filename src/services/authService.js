import api from './api'
import { API_ENDPOINTS } from './apiEndpoints'

export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  } catch (error) {
    throw error
  }
}

export const register = async (userData) => {
  try {
    const response = await api.post(API_ENDPOINTS.USUARIOS_COLEGIO.CREATE, userData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const recoverPassword = async (payload) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RECOVER_PASSWORD, payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const renewToken = async () => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RENEW_TOKEN)
    return response.data
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    return response.data
  } catch (error) {
    throw error
  }
}