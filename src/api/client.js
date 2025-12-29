import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

export const fetchRealTimeData = () => {
  return apiClient.get('api.php', {
    params: { action: 'getAllData', timeframe: '1hour', limit: 100 }
  })
}

export const fetchHistoryData = (timeframe = '1hour', limit = 8640) => {
  return apiClient.get('api.php', {
    params: { action: 'getAllData', timeframe, limit }
  })
}

export const fetchRangeDefinitions = () => {
  return apiClient.get('api.php', {
    params: { action: 'getRangeDefinitions' }
  })
}

export const fetchFuzzyRules = () => {
  return apiClient.get('api.php', {
    params: { action: 'getFuzzyRules' }
  })
}

export const setDeviceStatus = (params) => {
  return apiClient.post('api.php', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export default apiClient
