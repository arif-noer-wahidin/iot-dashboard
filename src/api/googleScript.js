export * from './googleScriptClient'
export { default } from './googleScriptClient'
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
function historyActionForTimeframe(timeframe) {
  if (timeframe === '1hour') return 'history1hour'
  if (timeframe === '1day') return 'history1day'
  if (timeframe === '1week') return 'history1week'
  return 'history'
}
export async function fetchAllData(timeframe = '1hour', limit = 8640) {
  const historyAction = historyActionForTimeframe(timeframe)
  const realtimeUrl = `${GOOGLE_SCRIPT_URL}?action=realtime`
  const historyUrl = `${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`

  try {
    const [realtime, history] = await Promise.all([
      safeFetch(realtimeUrl, { timeout: 7000 }),
      safeFetch(historyUrl, { timeout: 8000 }),
    ])
    return { realtime, history }
  } catch (err) {
    try {
  const proxyRealtime = await safeFetch(`/api.php?action=realtime`, { timeout: 5000 })
  const proxyHistory = await safeFetch(`/api.php?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`, { timeout: 7000 })
  return { realtime: proxyRealtime, history: proxyHistory }
    } catch (err2) {
      throw err
    }
  }
export async function fetchRangeDefinitions() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getRangeDefinitions`
  try {
    return await safeFetch(url, { timeout: 6000 })
  } catch (err) {
    return safeFetch(`/api.php?action=getRangeDefinitions`, { timeout: 4000 })
export async function fetchFuzzyRules() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getFuzzyRules`
  try {
    return await safeFetch(url, { timeout: 6000 })
  } catch (err) {
    return safeFetch(`/api.php?action=getFuzzyRules`, { timeout: 4000 })
export async function setStatus(params = {}) {
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'setStatus', ...params }),
      timeout: 7000,
    })
  } catch (err) {
    const form = new URLSearchParams({ action: 'setStatus', ...params })
    return safeFetch(`/api.php`, {
      method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: form.toString(),
  timeout: 7000,
    })
  }
}
export default { fetchAllData, fetchRangeDefinitions, fetchFuzzyRules, setStatus }
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycby8YXLCdKBokYmEh-USQZoMCgP0oPyn-8eG7nsu-JWGKLzqyj8JV8K39ZCP-mdxcL6vhA/exec'

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

function historyActionForTimeframe(timeframe) {
  if (timeframe === '1hour') return 'history1hour'
  if (timeframe === '1day') return 'history1day'
  if (timeframe === '1week') return 'history1week'
  return 'history'
}
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycby8YXLCdKBokYmEh-USQZoMCgP0oPyn-8eG7nsu-JWGKLzqyj8JV8K39ZCP-mdxcL6vhA/exec'

async function safeFetch(url, options = {}) {
  // options may include signal for AbortController and timeout (ms)
  const { timeout, ...fetchOptions } = options
  const controller = new AbortController()
  const signal = fetchOptions.signal || controller.signal
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null

  let res
  try {
    res = await fetch(url, { ...fetchOptions, signal })
  } catch (err) {
    if (timer) clearTimeout(timer)
    // Normalize network/CORS errors
    throw new Error(err.message || 'Network error or CORS blocked')
  }
  if (timer) clearTimeout(timer)

  const contentType = res.headers.get('content-type') || ''
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (contentType.includes('application/json')) return res.json()
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { message: text } }
}

function historyActionForTimeframe(timeframe) {
  if (timeframe === '1hour') return 'history1hour'
  if (timeframe === '1day') return 'history1day'
  if (timeframe === '1week') return 'history1week'
  return 'history'
}

export async function fetchAllData(timeframe = '1hour', limit = 8640) {
  // realtime and history in parallel
  const historyAction = historyActionForTimeframe(timeframe)
  const realtimeUrl = `${GOOGLE_SCRIPT_URL}?action=realtime`
  const historyUrl = `${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`

  try {
    const [realtime, history] = await Promise.all([
      safeFetch(realtimeUrl),
      safeFetch(historyUrl),
    ])
    return { realtime, history }
  } catch (err) {
    // fallback to local PHP proxy if direct fetch fails (CORS or network)
    try {
      const proxyRealtime = await safeFetch(`/api.php?action=realtime`)
      const proxyHistory = await safeFetch(`/api.php?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`)
      return { realtime: proxyRealtime, history: proxyHistory }
    } catch (err2) {
      throw err // original error
    }
  }
}

export async function fetchRangeDefinitions() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getRangeDefinitions`
  try {
    return await safeFetch(url)
  } catch (err) {
    // fallback to local proxy
    return safeFetch(`/api.php?action=getRangeDefinitions`)
  }
}

export async function fetchFuzzyRules() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getFuzzyRules`
  try {
    return await safeFetch(url)
  } catch (err) {
    return safeFetch(`/api.php?action=getFuzzyRules`)
  }
}

export async function setStatus(params = {}) {
  // params should be an object of key/values
  // Send as JSON to Apps Script; if it fails (CORS/network), fallback to local PHP proxy
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setStatus', ...params }),
    })
  } catch (err) {
    // fallback: send form data to local api.php which expects POST form params
    const form = new URLSearchParams({ action: 'setStatus', ...params })
    return safeFetch(`/api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
  }
}

export default { fetchAllData, fetchRangeDefinitions, fetchFuzzyRules, setStatus }
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycby8YXLCdKBokYmEh-USQZoMCgP0oPyn-8eG7nsu-JWGKLzqyj8JV8K39ZCP-mdxcL6vhA/exec'

async function safeFetch(url, options = {}) {
  // options may include signal for AbortController and timeout (ms)
  const { timeout, ...fetchOptions } = options
  const controller = new AbortController()
  const signal = fetchOptions.signal || controller.signal
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null

  let res
  try {
    res = await fetch(url, { ...fetchOptions, signal })
  } catch (err) {
    if (timer) clearTimeout(timer)
    // Normalize network/CORS errors
    throw new Error(err.message || 'Network error or CORS blocked')
  }
  if (timer) clearTimeout(timer)
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { message: text } }
}

function historyActionForTimeframe(timeframe) {
  if (timeframe === '1hour') return 'history1hour'
  if (timeframe === '1day') return 'history1day'
  if (timeframe === '1week') return 'history1week'
  return 'history'
}

export async function fetchAllData(timeframe = '1hour', limit = 8640) {
  // realtime and history in parallel
  const historyAction = historyActionForTimeframe(timeframe)
  const realtimeUrl = `${GOOGLE_SCRIPT_URL}?action=realtime`
  const historyUrl = `${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`

  try {
    const [realtime, history] = await Promise.all([
      safeFetch(realtimeUrl),
      safeFetch(historyUrl),
    ])
    return { realtime, history }
  } catch (err) {
    // fallback to local PHP proxy if direct fetch fails (CORS or network)
    try {
      const proxyRealtime = await safeFetch(`/api.php?action=realtime`)
      const proxyHistory = await safeFetch(`/api.php?action=${encodeURIComponent(historyAction)}&limit=${encodeURIComponent(limit)}`)
      return { realtime: proxyRealtime, history: proxyHistory }
    } catch (err2) {
      throw err // original error
    }
  }
}

export async function fetchRangeDefinitions() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getRangeDefinitions`
  try {
    return await safeFetch(url)
  } catch (err) {
    // fallback to local proxy
    return safeFetch(`/api.php?action=getRangeDefinitions`)
  }
}

export async function fetchFuzzyRules() {
  const url = `${GOOGLE_SCRIPT_URL}?action=getFuzzyRules`
  try {
    return await safeFetch(url)
  } catch (err) {
    return safeFetch(`/api.php?action=getFuzzyRules`)
  }
}

export async function setStatus(params = {}) {
  // params should be an object of key/values
  // Send as JSON to Apps Script; if it fails (CORS/network), fallback to local PHP proxy
  try {
    return await safeFetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setStatus', ...params }),
    })
  } catch (err) {
    // fallback: send form data to local api.php which expects POST form params
    const form = new URLSearchParams({ action: 'setStatus', ...params })
    return safeFetch(`/api.php`, {
      // options may include signal for AbortController and timeout (ms)
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
