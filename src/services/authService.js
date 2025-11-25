// src/services/authService.js
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios-colegio/login`, {
      email: credentials.email,
      password: credentials.password
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios-colegio`, userData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const recoverPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios-colegio/recuperar-contraseña`, {
      email
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios-colegio/restablecer-contraseña`, {
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
    const response = await axios.post(`${API_URL}/usuarios-colegio/renovar-token`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/usuarios-colegio/logout`)
    return response.data
  } catch (error) {
    throw error
  }
}