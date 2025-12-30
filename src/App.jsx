import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import SensorCard from './components/SensorCard'
import React, { Suspense } from 'react'
import DeviceControl from './components/DeviceControl'
import TimerControl from './components/TimerControl'
import LoginModal from './components/LoginModal'
import UnauthorizedModal from './components/UnauthorizedModal'
// import Settings from './components/Settings'
import { setStatus } from './api/googleScriptClient'
const HistoryChart = React.lazy(() => import('./components/HistoryChart'))
import FilterButtons from './components/FilterButtons'
import ErrorToast from './components/ErrorToast'
import RecommendationCard from './components/RecommendationCard'
import { fetchAllData } from './api/googleScriptClient'

dayjs.extend(utc)
dayjs.extend(timezone)

function App() {
  // --- Simple hardcoded auth (username/password in code) ---
  const AUTH_USER = 'admin'
  const AUTH_PASS = 'password123'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUnauthorized, setShowUnauthorized] = useState(false)

  const tryLogin = (u, p) => {
    if (u === AUTH_USER && p === AUTH_PASS) {
      setIsAuthenticated(true)
      setShowLogin(false)
      return true
    }
    alert('Username atau password salah')
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
  }
  const onRequireAuth = (action) => {
    // show large unauthorized modal
    setShowUnauthorized(true)
  }
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
  // Relay & Timer state
  const [relay1, setRelay1] = useState(false)
  const [relay2, setRelay2] = useState(false)
  const [timer1On, setTimer1On] = useState('')
  const [timer1Off, setTimer1Off] = useState('')
  const [timer2On, setTimer2On] = useState('')
  const [timer2Off, setTimer2Off] = useState('')
  const [isSavingRelay, setIsSavingRelay] = useState(false)
  const [isSavingTimer, setIsSavingTimer] = useState({ t1: false, t2: false })
  

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

        // relay status (support different shapes from Apps Script)
        const r1 = realtime.relay1 ?? realtime.relay_1 ?? realtime.relay_01
        const r2 = realtime.relay2 ?? realtime.relay_2 ?? realtime.relay_02
        const normalizeOn = v => (v === 1 || v === '1' || String(v).toLowerCase() === 'on' || v === true)
        setRelay1(normalizeOn(r1))
        setRelay2(normalizeOn(r2))

        // timers may be ISO timestamps; normalize to HH:mm local
        const toHHMM = (val) => {
          if (!val) return ''
          try {
            return dayjs(val).tz('Asia/Jakarta').format('HH:mm')
          } catch (_) {
            return String(val).substr(0,5)
          }
        }
        setTimer1On(toHHMM(realtime.timer1On ?? realtime.timer1on ?? realtime.Timer1On))
        setTimer1Off(toHHMM(realtime.timer1Off ?? realtime.timer1off ?? realtime.Timer1Off))
        setTimer2On(toHHMM(realtime.timer2On ?? realtime.timer2on ?? realtime.Timer2On))
        setTimer2Off(toHHMM(realtime.timer2Off ?? realtime.timer2off ?? realtime.Timer2Off))

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
      // Ignore aborted requests (timeout/controller) silently
      if (err && err.name === 'AbortError') {
        setIsLoading(false)
        return
      }
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

  // Relay toggle handler
  const toggleRelay = async (which) => {
    if (!isAuthenticated) { onRequireAuth('mengubah status relay'); return }
    try {
      setIsSavingRelay(true)
      if (which === 1) {
        const newVal = !relay1
        await setStatus({ relay1: newVal ? 1 : 0 })
        setRelay1(newVal)
      } else {
        const newVal = !relay2
        await setStatus({ relay2: newVal ? 1 : 0 })
        setRelay2(newVal)
      }
      // refresh realtime after change
      updateSensorData()
    } catch (err) {
      if (err && err.name === 'AbortError') {
        setError('Permintaan dibatalkan, coba lagi')
        setShowError(true)
      } else {
        setError(err.message || 'Gagal mengubah status relay')
        setShowError(true)
      }
    } finally {
      setIsSavingRelay(false)
    }
  }

  // Timer save handlers
  const saveTimer1 = async (onVal, offVal) => {
    if (!isAuthenticated) { onRequireAuth('mengubah timer relay 1'); return }
    try {
      setIsSavingTimer(prev => ({ ...prev, t1: true }))
      await setStatus({ timer1On: onVal || '', timer1Off: offVal || '' })
      setTimer1On(onVal || '')
      setTimer1Off(offVal || '')
      updateSensorData()
    } catch (err) {
      if (err && err.name === 'AbortError') {
        setError('Permintaan dibatalkan, coba lagi')
        setShowError(true)
      } else {
        setError(err.message || 'Gagal menyimpan timer 1')
        setShowError(true)
      }
    } finally {
      setIsSavingTimer(prev => ({ ...prev, t1: false }))
    }
  }

  const saveTimer2 = async (onVal, offVal) => {
    if (!isAuthenticated) { onRequireAuth('mengubah timer relay 2'); return }
    try {
      setIsSavingTimer(prev => ({ ...prev, t2: true }))
      await setStatus({ timer2On: onVal || '', timer2Off: offVal || '' })
      setTimer2On(onVal || '')
      setTimer2Off(offVal || '')
      updateSensorData()
    } catch (err) {
      if (err && err.name === 'AbortError') {
        setError('Permintaan dibatalkan, coba lagi')
        setShowError(true)
      } else {
        setError(err.message || 'Gagal menyimpan timer 2')
        setShowError(true)
      }
    } finally {
      setIsSavingTimer(prev => ({ ...prev, t2: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <ErrorToast message={error} isVisible={showError} onClose={() => setShowError(false)} />

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={tryLogin} />
      <UnauthorizedModal isOpen={showUnauthorized} onClose={() => setShowUnauthorized(false)} onLogin={() => { setShowUnauthorized(false); setShowLogin(true); }} />

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
            <div className="ml-4">
              {/* <button onClick={() => setShowSettings(true)} className="bg-gray-800 px-3 py-1 rounded mr-2">Settings</button> */}
              {isAuthenticated ? (
                <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
              ) : (
                <button onClick={() => setShowLogin(true)} className="bg-green-500 px-3 py-1 rounded">Login</button>
              )}
            </div>
          </div>
        </header>

        {/* Main Grid */}
        {showSettings ? (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="bg-gray-700 px-3 py-1 rounded">Kembali</button>
            </div>
            <Settings isAuthenticated={isAuthenticated} onRequireAuth={onRequireAuth} />
          </div>
        ) : (
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
            
            {/* Device Controls & Timers */}
            <section>
              <h2 className="text-lg font-semibold text-gray-200 mb-3">Kontrol Perangkat</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <DeviceControl
                  label="Relay 1"
                  isActive={relay1}
                  onToggle={() => toggleRelay(1)}
                  isLoading={isSavingRelay}
                  disabled={!isAuthenticated}
                />
                <DeviceControl
                  label="Relay 2"
                  isActive={relay2}
                  onToggle={() => toggleRelay(2)}
                  isLoading={isSavingRelay}
                  disabled={!isAuthenticated}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <TimerControl
                  label="Timer Relay 1"
                  onTime={timer1On}
                  offTime={timer1Off}
                  onSave={saveTimer1}
                  isLoading={isSavingTimer.t1}
                  disabled={!isAuthenticated}
                />
                <TimerControl
                  label="Timer Relay 2"
                  onTime={timer2On}
                  offTime={timer2Off}
                  onSave={saveTimer2}
                  isLoading={isSavingTimer.t2}
                  disabled={!isAuthenticated}
                />
              </div>
            </section>
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
      )}
      </main>
    </div>
  )
}

export default App
