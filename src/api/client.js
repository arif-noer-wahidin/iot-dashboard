import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

export const fetchRealTimeData = (timeframe = '1hour', limit = 100) => {
  return apiClient.get('/realtime', {
    params: { timeframe, limit }
  })
}

export const fetchHistoryData = (timeframe = '1hour', limit = 8640) => {
  return apiClient.get('/history', {
    params: { timeframe, limit }
  })
}

export const fetchRangeDefinitions = () => {
  return apiClient.get('/range-definitions')
}

export const fetchFuzzyRules = () => {
  return apiClient.get('/fuzzy-rules')
}

export const setDeviceStatus = (params) => {
  return apiClient.post('/status', params, {
    headers: { 'Content-Type': 'application/json' }
  })
}

export default apiClient
