import { create } from 'zustand'
import { userAPI } from '../services/api'

const savedToken = localStorage.getItem('token')
const savedUser = localStorage.getItem('user')

export const useAuthStore = create((set) => ({
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,

  loadToken: () => {
    // Kept for backward compatibility, already loaded synchronously above
    const currentToken = localStorage.getItem('token')
    const currentUser = localStorage.getItem('user')
    if (currentToken) {
      set({ token: currentToken, user: JSON.parse(currentUser) })
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await userAPI.register(userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, loading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      set({ error: message, loading: false })
      throw error
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const response = await userAPI.login(credentials)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, loading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      set({ error: message, loading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },

  getProfile: async () => {
    try {
      const response = await userAPI.getProfile()
      set({ user: response.data.user })
      return response.data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await userAPI.updateProfile(data)
      set({ user: response.data.user })
      return response.data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  },
}))
