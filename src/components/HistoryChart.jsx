import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

import React from 'react'

const HistoryChart = ({ data, timeframe, isLoading }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null
    // Ensure data is in chronological order (oldest -> newest)
    const ordered = Array.isArray(data) ? data.slice().reverse() : data

    const labels = ordered.map(d => {
      const time = dayjs(d.timestamp)
      if (timeframe === '1hour') return time.format('HH:mm')
      if (timeframe === '1day') return time.format('HH:mm')
      return time.format('ddd HH:00')
    })
    return {
      labels,
      datasets: [
        {
          label: 'Suhu (°C)',
          data: ordered.map(d => parseFloat(d.suhu) || 0),
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: 'pH',
          data: ordered.map(d => parseFloat(d.ph) || 0),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: 'y1',
        },
        {
          label: 'TDS (ppm)',
          data: ordered.map(d => parseFloat(d.tds) || 0),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: 'y2',
        },
      ],
    }
  }, [data, timeframe])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: { color: '#d1d5db', boxWidth: 12, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4b5563',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Suhu (°C)', color: '#f87171', font: { size: 11 } },
        grid: { color: '#374151' },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'center',
        title: { display: true, text: 'pH', color: '#60a5fa', font: { size: 11 } },
        grid: { drawOnChartArea: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'TDS', color: '#34d399', font: { size: 11 } },
        grid: { drawOnChartArea: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
    },
  }), [])

  if (!chartData) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 flex items-center justify-center h-80">
        <p className="text-gray-400 text-sm">{isLoading ? 'Memuat data...' : 'Tidak ada data'}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <Line data={chartData} options={options} height={300} />
    </div>
  )
}

export default React.memo(HistoryChart)
