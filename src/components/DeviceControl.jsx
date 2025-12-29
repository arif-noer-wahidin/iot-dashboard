import React from 'react'

const DeviceControl = ({ label, isActive, onToggle, isLoading }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <span className="text-gray-200 font-medium">{label}</span>
        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            isActive ? 'bg-green-500' : 'bg-gray-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
          aria-label={`Toggle ${label}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

export default React.memo(DeviceControl)
