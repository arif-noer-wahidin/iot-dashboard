import React, { useEffect, useState } from 'react'
import { fetchCalibrations, updateCalibrations, fetchRangeDefinitions, updateRangeDefinitions, fetchFuzzyRules, updateFuzzyRules } from '../api/googleScriptClient'

export default function AdminPanel() {
  const [cal, setCal] = useState([])
  const [rangeDefs, setRangeDefs] = useState([])
  const [fuzzy, setFuzzy] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setError(null)
    try {
      const [c, r, f] = await Promise.all([
        fetchCalibrations(),
        fetchRangeDefinitions(),
        fetchFuzzyRules(),
      ])
      setCal(Array.isArray(c) ? c : [])
      setRangeDefs(Array.isArray(r) ? r : [])
      setFuzzy(Array.isArray(f) ? f : [])
    } catch (err) {
      setError(err.message || String(err))
    }
  }

  function updateCalRow(idx, col, value) {
    const copy = cal.slice()
    copy[idx][col] = value
    setCal(copy)
  }

  async function saveCalibrations() {
    setSaving(true)
    setError(null)
    try {
      // Expect sheet rows as arrays [Key, Value, Description]
      await updateCalibrations(cal)
      await loadAll()
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  async function saveRangeDefs() {
    setSaving(true); setError(null)
    try {
      // Convert rangeDefs (array of objects or arrays) into arrays of 4 columns
      const rows = rangeDefs.map(r => Array.isArray(r) ? r : [r.Variabel || r.variable || '', r.Kategori || r.category || '', r.Min || r.min || '', r.Max || r.max || ''])
      await updateRangeDefinitions(rows)
      await loadAll()
    } catch (err) {
      setError(err.message || String(err))
    } finally { setSaving(false) }
  }

  async function saveFuzzy() {
    setSaving(true); setError(null)
    try {
      const rows = fuzzy.map(r => Array.isArray(r) ? r : [r.RuleID || r.id || '', r.Suhu || r.suhu || '', r.pH || r.pH || '', r.TDS || r.tds || '', r['Aksi Direkomendasikan'] || r.aksi || ''])
      await updateFuzzyRules(rows)
      await loadAll()
    } catch (err) {
      setError(err.message || String(err))
    } finally { setSaving(false) }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Admin Panel</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <section className="mb-6">
        <h3 className="font-medium mb-2">Calibrations</h3>
        <div className="overflow-auto max-h-64 border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">Key</th>
                <th className="p-2">Value</th>
                <th className="p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {cal.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2"><input className="w-full" value={row[0]||''} onChange={e=>updateCalRow(i,0,e.target.value)} /></td>
                  <td className="p-2"><input className="w-full" value={row[1]||''} onChange={e=>updateCalRow(i,1,e.target.value)} /></td>
                  <td className="p-2"><input className="w-full" value={row[2]||''} onChange={e=>updateCalRow(i,2,e.target.value)} /></td>
                </tr>
              ))}
              {cal.length===0 && <tr><td className="p-2" colSpan={3}>No calibrations</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <button className="btn-primary mr-2" onClick={saveCalibrations} disabled={saving}>{saving? 'Saving...':'Save Calibrations'}</button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-medium mb-2">Range Definitions (preview)</h3>
        <div className="overflow-auto max-h-48 border rounded p-2 text-xs">
          <pre className="whitespace-pre-wrap">{JSON.stringify(rangeDefs, null, 2)}</pre>
        </div>
        <div className="mt-2">
          <button className="btn-primary mr-2" onClick={saveRangeDefs} disabled={saving}>{saving? 'Saving...':'Save RangeDefinitions'}</button>
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-2">Fuzzy Rules (preview)</h3>
        <div className="overflow-auto max-h-48 border rounded p-2 text-xs">
          <pre className="whitespace-pre-wrap">{JSON.stringify(fuzzy, null, 2)}</pre>
        </div>
        <div className="mt-2">
          <button className="btn-primary" onClick={saveFuzzy} disabled={saving}>{saving? 'Saving...':'Save FuzzyRules'}</button>
        </div>
      </section>
    </div>
  )
}
