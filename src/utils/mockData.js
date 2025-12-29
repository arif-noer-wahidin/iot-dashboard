/**
 * Mock Data Generator untuk Sensor IoT
 * Menghasilkan data suhu, pH, TDS secara real-time
 */

const generateSensorReading = () => {
  // Generate data dengan variasi yang realistis
  const suhu = 26 + Math.random() * 4 // 26-30°C
  const ph = 6.5 + Math.random() * 1.5 // 6.5-8°C
  const tds = 200 + Math.random() * 300 // 200-500 ppm

  return {
    suhu: suhu.toFixed(1),
    ph: ph.toFixed(1),
    tds: Math.round(tds),
    timestamp: new Date().toISOString(),
  }
}

const getStatusSensor = (sensor, value) => {
  const val = parseFloat(value)

  if (sensor === 'suhu') {
    if (val >= 24 && val <= 28) return 'ideal'
    if (val >= 22 && val < 24) return 'dingin'
    if (val > 28 && val <= 30) return 'panas'
    return 'critical'
  }

  if (sensor === 'ph') {
    if (val >= 6.5 && val <= 7.5) return 'ideal'
    if (val >= 7.5 && val <= 8) return 'basa'
    if (val < 6.5) return 'asam'
    return 'critical'
  }

  if (sensor === 'tds') {
    if (val >= 150 && val <= 300) return 'ideal'
    if (val > 300 && val <= 500) return 'tinggi'
    if (val < 150) return 'rendah'
    return 'critical'
  }

  return 'unknown'
}

// Generate 24 jam data history
export const generateHistoryData = (hours = 24) => {
  const data = []
  const now = new Date()

  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000)
    const baseTemp = 26 + Math.sin(i / 24 * Math.PI * 2) * 2
    const basePh = 7 + Math.cos(i / 24 * Math.PI * 2) * 0.5
    const baseTds = 300 + Math.sin(i / 24 * Math.PI * 3) * 100

    data.push({
      timestamp: time.toISOString(),
      suhu: (baseTemp + (Math.random() - 0.5)).toFixed(1),
      ph: (basePh + (Math.random() - 0.5) * 0.3).toFixed(1),
      tds: Math.round(baseTds + (Math.random() - 0.5) * 50),
    })
  }

  return data
}

export const getRealtimeData = () => {
  const reading = generateSensorReading()

  return {
    suhu: reading.suhu,
    suhuStatus: getStatusSensor('suhu', reading.suhu),
    ph: reading.ph,
    phStatus: getStatusSensor('ph', reading.ph),
    tds: reading.tds,
    tdsStatus: getStatusSensor('tds', reading.tds),
    fuzzyRekomendasi: generateRecommendation(
      getStatusSensor('suhu', reading.suhu),
      getStatusSensor('ph', reading.ph),
      getStatusSensor('tds', reading.tds)
    ),
    timestamp: reading.timestamp,
  }
}

const generateRecommendation = (suhuStatus, phStatus, tdsStatus) => {
  const recommendations = []

  if (suhuStatus === 'dingin') recommendations.push('Suhu terlalu dingin, nyalakan heater.')
  if (suhuStatus === 'panas') recommendations.push('Suhu terlalu panas, kurangi cahaya atau tambah pendingin.')
  if (suhuStatus === 'critical') recommendations.push('⚠️ Suhu kritis, ambil tindakan segera!')

  if (phStatus === 'asam') recommendations.push('pH terlalu asam, tambahkan buffer.')
  if (phStatus === 'basa') recommendations.push('pH terlalu basa, kurangi makanan.')
  if (phStatus === 'critical') recommendations.push('⚠️ pH kritis, lakukan penggantian air sebagian.')

  if (tdsStatus === 'rendah') recommendations.push('TDS rendah, tambahkan nutrisi.')
  if (tdsStatus === 'tinggi') recommendations.push('TDS tinggi, lakukan water change.')
  if (tdsStatus === 'critical') recommendations.push('⚠️ TDS kritis, segera lakukan water change!')

  if (recommendations.length === 0) {
    return 'Kondisi aquascape optimal, pertahankan kondisi saat ini. ✓'
  }

  return recommendations.join(' ')
}

export const getRangeDefinitions = () => [
  { name: 'Suhu Air', min: 24, max: 28, unit: '°C', status: 'Ideal' },
  { name: 'pH Air', min: 6.5, max: 7.5, unit: '', status: 'Ideal' },
  { name: 'TDS', min: 150, max: 300, unit: 'ppm', status: 'Ideal' },
]

export const getFuzzyRules = () => [
  { kondisi: 'Suhu Ideal + pH Ideal', aksi: 'Pertahankan kondisi' },
  { kondisi: 'Suhu Tinggi', aksi: 'Matikan heater, tambah cahaya rendah' },
  { kondisi: 'Suhu Rendah', aksi: 'Nyalakan heater' },
  { kondisi: 'pH Asam', aksi: 'Tambah buffer pH' },
  { kondisi: 'pH Basa', aksi: 'Kurangi pemberian makanan' },
  { kondisi: 'TDS Tinggi', aksi: 'Lakukan water change 30%' },
  { kondisi: 'TDS Rendah', aksi: 'Tambah nutrisi/makanan' },
]
