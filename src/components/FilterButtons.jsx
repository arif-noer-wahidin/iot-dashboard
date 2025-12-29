const FilterButtons = ({ currentFilter, onFilterChange, isLoading }) => {
  const filters = [
    { value: '1hour', label: '1 Jam' },
    { value: '1day', label: '1 Hari' },
    { value: '1week', label: '1 Minggu' },
  ]

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          disabled={isLoading}
          className={`px-4 py-2 rounded font-medium transition text-sm ${
            currentFilter === filter.value
              ? 'bg-green-500 text-gray-900'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons
