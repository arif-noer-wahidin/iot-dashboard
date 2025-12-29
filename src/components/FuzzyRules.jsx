const FuzzyRules = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Memuat aturan fuzzy...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Tidak ada aturan fuzzy.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
      <h3 className="text-white font-semibold mb-3">Aturan Fuzzy</h3>
      <div className="table-scroll-container bg-gray-700 rounded-lg">
        <table className="history-table w-full">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Suhu</th>
              <th>pH</th>
              <th>TDS</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="px-2 py-2">{row.RuleID ?? row.id ?? idx + 1}</td>
                <td className="px-2 py-2">{row.Suhu ?? row.suhu ?? '-'}</td>
                <td className="px-2 py-2">{row.pH ?? row.ph ?? '-'}</td>
                <td className="px-2 py-2">{row.TDS ?? row.tds ?? '-'}</td>
                <td className="px-2 py-2">{row['Aksi Direkomendasikan'] ?? row.action ?? row.aksi ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FuzzyRules
