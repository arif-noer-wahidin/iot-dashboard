import React, { useState, useEffect } from 'react'

const TimerControl = ({ label, onTime = '', offTime = '', onSave, isLoading, disabled }) => {
  const [on, setOn] = useState(onTime)
  const [off, setOff] = useState(offTime)

  useEffect(() => {
    setOn(onTime || '')
  }, [onTime])

  useEffect(() => {
    setOff(offTime || '')
  }, [offTime])

  const handleSave = () => {
    if (typeof onSave === 'function') onSave(on || '', off || '')
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h4 className="text-gray-200 font-semibold mb-3">{label}</h4>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-400 block mb-1 font-medium">Waktu ON</label>
          <input
            type="time"
            value={on}
            onChange={(e) => setOn(e.target.value)}
            disabled={isLoading}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1 font-medium">Waktu OFF</label>
          <input
            type="time"
            value={off}
            onChange={(e) => setOff(e.target.value)}
            disabled={isLoading}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading || disabled}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-gray-900 font-semibold py-2 rounded transition text-sm"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}

export default React.memo(TimerControl)
