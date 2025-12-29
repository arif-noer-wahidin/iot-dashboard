import React from 'react'

const SensorCard = ({ label, value, unit, status, icon }) => {
  const statusColorMap = {
    ideal: 'bg-green-500',
    optimal: 'bg-green-500',
    panas: 'bg-yellow-500',
    dingin: 'bg-yellow-500',
    asam: 'bg-yellow-500',
    basa: 'bg-yellow-500',
    tinggi: 'bg-yellow-500',
    rendah: 'bg-yellow-500',
    critical: 'bg-red-500',
  }

  const statusColor = statusColorMap[String(status).toLowerCase()] || 'bg-gray-500'

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={`text-xs px-2 py-1 rounded ${statusColor} text-gray-900 font-semibold`}>
          {status || 'N/A'}
        </span>
      </div>
      <div className="flex items-end gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-gray-400 text-sm ml-1">{unit}</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SensorCard)
