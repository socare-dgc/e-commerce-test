import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)
