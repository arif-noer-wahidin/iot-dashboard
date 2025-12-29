import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import SensorCard from './components/SensorCard'
import React, { Suspense } from 'react'
const HistoryChart = React.lazy(() => import('./components/HistoryChart'))
import FilterButtons from './components/FilterButtons'
import ErrorToast from './components/ErrorToast'
import RecommendationCard from './components/RecommendationCard'
import { fetchAllData } from './api/googleScriptClient'

dayjs.extend(utc)
dayjs.extend(timezone)

function App() {
  // Sensor state
  const [sensorData, setSensorData] = useState({
    suhu: 0,
    suhuStatus: 'N/A',
    ph: 0,
    phStatus: 'N/A',
    tds: 0,
    tdsStatus: 'N/A',
  })

  // Device control state removed

  // UI state
  const [currentFilter, setCurrentFilter] = useState('1hour')
  const [historyData, setHistoryData] = useState([])
  
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [fuzzyRecommendation, setFuzzyRecommendation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')
  

  const refreshIntervalRef = useRef(null)
  const historyCacheRef = useRef({})

  // Update sensor data
  const updateSensorData = useCallback(async () => {
    setIsLoading(true)
    try {
      // choose a reasonable history limit based on selected timeframe to avoid huge payloads
      const limitFor = (tf) => {
        if (tf === '1hour') return 200
        if (tf === '1day') return 800
        if (tf === '1week') return 2000
        return 3000
      }
      const { realtime, history } = await fetchAllData(currentFilter, limitFor(currentFilter))

      if (realtime) {
        setSensorData({
          suhu: realtime.suhu ?? realtime.suhu_raw ?? 0,
          suhuStatus: realtime.suhuStatus ?? realtime.suhu_status ?? realtime.status_suhu ?? 'N/A',
          ph: realtime.ph ?? realtime.ph_raw ?? 0,
          phStatus: realtime.phStatus ?? realtime.ph_status ?? 'N/A',
          tds: realtime.tds ?? realtime.tds_raw ?? 0,
          tdsStatus: realtime.tdsStatus ?? realtime.tds_status ?? 'N/A',
        })

        setFuzzyRecommendation(
          realtime.fuzzyRekomendasi ?? realtime.fuzzy_rekomendasi ?? realtime.fuzzy_rekomendasi ?? realtime.fuzzy ?? realtime.fuzzyRekomendasi ?? realtime.rekomendasi ?? ''
        )
      }

      if (history && Array.isArray(history)) {
        setHistoryData(history)
        // cache by timeframe
        historyCacheRef.current[currentFilter] = history
      }

      setLastUpdated(dayjs().tz('Asia/Jakarta').format('HH:mm:ss'))
    } catch (err) {
      setError(err.message || 'Gagal memperbarui data dari Google Script')
      setShowError(true)
    } finally {
      setIsLoading(false)
    }
  }, [currentFilter])

  // Range/fuzzy admin removed from UI; fetch helpers retained for potential future use

  // Prefetch other timeframes into cache
  const prefetchData = useCallback(async (timeframe) => {
    if (historyCacheRef.current[timeframe]) return
    try {
      const { history } = await fetchAllData(timeframe)
      if (Array.isArray(history)) historyCacheRef.current[timeframe] = history
    } catch (err) {
      console.warn('Prefetch error for', timeframe, err)
    }
  }, [])

  // when filter changes, fetch data from Google Script (history result included in updateSensorData)
  useEffect(() => {
    // trigger a fetch when timeframe changes
    updateSensorData()
  }, [currentFilter, updateSensorData])

  // Device/timer controls removed from UI

  // Initial fetch dan setup refresh
  useEffect(() => {
    updateSensorData()

    // prefetch other ranges (cached at client)
    prefetchData('1day')
    prefetchData('1week')
    prefetchData('all')

    // visibility-aware polling: when page hidden, poll less frequently
    const VISIBLE_INTERVAL = 15000
    const HIDDEN_INTERVAL = 60000

    const startPolling = (ms) => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = setInterval(() => {
        updateSensorData()
      }, ms)
    }

    // start based on current visibility
    startPolling(document && document.hidden ? HIDDEN_INTERVAL : VISIBLE_INTERVAL)

    const onVisibility = () => {
      startPolling(document.hidden ? HIDDEN_INTERVAL : VISIBLE_INTERVAL)
      if (!document.hidden) {
        // immediate refresh when returning to tab
        updateSensorData()
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [updateSensorData, prefetchData])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <ErrorToast message={error} isVisible={showError} onClose={() => setShowError(false)} />

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-700">
          <div>
            <h1 className="text-4xl font-bold text-green-400">🌿 Aquascape Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Monitoring real-time sistem Aquascape modern</p>
          </div>
          <div className="text-xs text-gray-400 mt-4 md:mt-0 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{lastUpdated || 'Memuat...'}</span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Sensors Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-200 mb-3">Status Sensor</h2>
              <div className="space-y-3">
                <SensorCard
                  label="Suhu Air"
                  value={sensorData.suhu}
                  unit="°C"
                  status={sensorData.suhuStatus}
                  icon="🌡️"
                />
                <SensorCard
                  label="pH Air"
                  value={sensorData.ph}
                  unit=""
                  status={sensorData.phStatus}
                  icon="⚖️"
                />
                <SensorCard
                  label="TDS"
                  value={sensorData.tds}
                  unit="ppm"
                  status={sensorData.tdsStatus}
                  icon="💧"
                />
              </div>
            </section>

            {/* Recommendation */}
            <RecommendationCard fuzzyRecommendation={fuzzyRecommendation} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* History Chart */}
            <section>
              <h2 className="text-lg font-semibold text-gray-200 mb-3">Riwayat Data</h2>
              <FilterButtons
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
                isLoading={isLoading}
              />
              <Suspense fallback={<div className="bg-gray-800 rounded-lg p-6 border border-gray-700"><div className="h-64"><div className="h-6 mb-4 bg-gray-700 rounded animate-pulse w-32"></div><div className="space-y-2"><div className="h-3 bg-gray-700 rounded"></div><div className="h-3 bg-gray-700 rounded w-5/6"></div></div></div></div>}>
                <HistoryChart 
                  data={historyData} 
                  timeframe={currentFilter} 
                  isLoading={isLoading} 
                />
              </Suspense>
            </section>

            {/* Admin features removed */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
