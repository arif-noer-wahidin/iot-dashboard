import React, { useEffect, useState } from 'react'
import { fetchCalibrations, updateCalibrations } from '../api/googleScriptClient'

const TableEditor = ({ columns, rows, onChange, onAdd, onDelete }) => {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              {columns.map((c,i) => <th key={i} className="pb-2 pr-4">{c}</th>)}
              <th className="pb-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="align-top">
                {columns.map((c,ci) => (
                  <td key={ci} className="pr-4 pb-2">
                    <input value={r[ci] ?? ''} onChange={e => onChange(idx, ci, e.target.value)} className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-200" />
                  </td>
                ))}
                <td className="pb-2">
                  <button onClick={() => onDelete(idx)} className="text-red-400 hover:text-red-300">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">Tambah Baris</button>
      </div>
    </div>
  )
}

const Settings = ({ isAuthenticated, onRequireAuth }) => {
  const [tab, setTab] = useState('calibrations')

  // Calibrations: array of [Key, Value, Description]
  const [cal, setCal] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      const c = await fetchCalibrations()
      setCal(Array.isArray(c) ? c : [])
    } catch (e) { setCal([]) }
  }

  // Calibrations handlers
  const calChange = (i, ci, val) => {
    const copy = cal.slice(); copy[i] = copy[i] || [];
    copy[i][ci] = val; setCal(copy)
  }
  const calAdd = () => setCal(prev => ([...prev, ['', '', '']]))
  const calDelete = (i) => setCal(prev => prev.filter((_,idx)=>idx!==i))

  const saveCal = async () => {
    if (!isAuthenticated) {
      if (typeof onRequireAuth === 'function') return onRequireAuth('menyimpan Calibrations')
      return
    }
    try { setSaving(true); await updateCalibrations(cal); alert('Calibrations disimpan'); } catch(e){ alert(e.message||e) } finally{ setSaving(false) }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pengaturan Data</h2>
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-2 rounded bg-gray-700`} >Calibrations</button>
      </div>

      <div>
        <TableEditor columns={["Key","Value","Description"]} rows={cal} onChange={calChange} onAdd={calAdd} onDelete={calDelete} />
        <div className="mt-3"><button disabled={!isAuthenticated || saving} onClick={saveCal} className="bg-green-500 px-4 py-2 rounded">Simpan</button></div>
      </div>
    </div>
  )
}

export default React.memo(Settings)
