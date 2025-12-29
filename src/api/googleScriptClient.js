const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzIQgSyI1D2FLZHl9kgW5PyBsYI-yD2PSNFhqTzndZIHx0gcPUOUgrFdUpfBs0l3es3YA/exec'

async function safeFetch(url, options = {}) {
  const { timeout, ...fetchOptions } = options
  const controller = new AbortController()
  const signal = fetchOptions.signal || controller.signal
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null

  let res
  try {
    res = await fetch(url, { ...fetchOptions, signal })
  } catch (err) {
    if (timer) clearTimeout(timer)
    throw new Error(err.message || 'Network error or CORS blocked')
  }
  if (timer) clearTimeout(timer)

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { message: text } }
}

// Simple in-memory cache to avoid refetching identical requests too often
const _cache = new Map()
function cachedFetch(url, options = {}, ttl = 5000) {
  const key = url // options.method/body could be added for POST cases
  const now = Date.now()
  const entry = _cache.get(key)
  if (entry && (now - entry.ts) < ttl) {
    return Promise.resolve(entry.data)
  }
  return safeFetch(url, options).then(data => {
    _cache.set(key, { ts: Date.now(), data })
    return data
  })
}

function historyActionForTimeframe(timeframe) {
  if (timeframe === '1hour') return 'history1hour'
  if (timeframe === '1day') return 'history1day'
  if (timeframe === '1week') return 'history1week'
  return 'history'
}

export async function fetchAllData(timeframe = '1hour', limit = 500) {
  const historyAction = historyActionForTimeframe(timeframe)
  const realtimeUrl = `${GOOGLE_SCRIPT_URL}?action=realtime`
  const historyUrl = `${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`

  try {
    const [realtime, history] = await Promise.all([
      // realtime updates are cached briefly
      cachedFetch(realtimeUrl, { timeout: 7000 }, 5000),
      // history can be cached a bit longer
      cachedFetch(historyUrl, { timeout: 8000 }, 15000),
    ])
    return { realtime, history }
  } catch (err) {
    // Direct Apps Script fetch failed — propagate error to caller (no PHP fallback)
    throw err
  }
}

export async function fetchRangeDefinitions() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getRangeDefinitions`
  try {
    return await cachedFetch(url, { timeout: 6000 }, 60000)
  } catch (err) {
    throw err
  }
}

export async function fetchFuzzyRules() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getFuzzyRules`
  try {
    return await cachedFetch(url, { timeout: 6000 }, 60000)
  } catch (err) {
    throw err
  }
}

export async function fetchCalibrations() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getCalibrations`
  try {
    return await cachedFetch(url, { timeout: 5000 }, 60000)
  } catch (err) {
    throw err
  }
}

export async function updateCalibrations(dataArray) {
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateCalibrations', data: dataArray }),
      timeout: 8000,
    })
  } catch (err) {
    throw err
  }
}

export async function updateRangeDefinitions(dataArray) {
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateRangeDefinitions', data: dataArray }),
      timeout: 8000,
    })
  } catch (err) {
    throw err
  }
}

export async function updateFuzzyRules(dataArray) {
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateFuzzyRules', data: dataArray }),
      timeout: 8000,
    })
  } catch (err) {
    throw err
  }
}

export async function setStatus(params = {}) {
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setStatus', ...params }),
      timeout: 7000,
    })
  } catch (err) {
    // No local PHP proxy fallback — propagate error
    throw err
  }
}

export default { fetchAllData, fetchRangeDefinitions, fetchFuzzyRules, setStatus }
