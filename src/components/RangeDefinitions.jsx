const RangeDefinitions = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Memuat definisi rentang...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Tidak ada data definisi rentang.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
      <h3 className="text-white font-semibold mb-3">Definisi Rentang Parameter</h3>
      <div className="table-scroll-container bg-gray-700 rounded-lg">
        <table className="history-table w-full">
          <thead>
            <tr>
              <th>Variabel</th>
              <th>Kategori</th>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="px-2 py-2">{row.Variabel ?? row.name ?? row.name_var ?? '-'}</td>
                <td className="px-2 py-2">{row.Kategori ?? row.category ?? '-'}</td>
                <td className="px-2 py-2">{row.Min ?? row.min ?? '-'}</td>
                <td className="px-2 py-2">{row.Max ?? row.max ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RangeDefinitions
