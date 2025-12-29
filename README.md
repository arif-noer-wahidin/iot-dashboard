# Aquascape IoT Dashboard - React Version

Dashboard monitoring real-time untuk sistem akuascape dengan React dan Vite.

## 📋 Fitur

- ✅ Monitoring real-time sensor (Suhu, pH, TDS)
- ✅ Kontrol relay (ON/OFF)
- ✅ Pengaturan timer otomatis
- ✅ Visualisasi data dengan Chart.js
- ✅ Rekomendasi fuzzy logic
- ✅ Interface responsive dengan Tailwind CSS
- ✅ Dark mode by default
- ✅ Auto-refresh setiap 15 detik

## 🚀 Setup & Instalasi

### Prerequisites
- Node.js 16+ 
- npm atau yarn

### Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build
```

Development server akan berjalan di `http://localhost:3000`

## 📁 Struktur Folder

```
src/
├── components/          # React components
│   ├── SensorCard.jsx           # Card untuk menampilkan data sensor
│   ├── DeviceControl.jsx        # Toggle switch untuk relay
│   ├── TimerControl.jsx         # Input timer ON/OFF
│   ├── HistoryChart.jsx         # Chart riwayat sensor
│   ├── FilterButtons.jsx        # Filter timeframe
│   ├── ErrorToast.jsx           # Notification error
│   └── RecommendationCard.jsx   # Card rekomendasi
├── api/
│   └── client.js                # API client dengan axios
├── App.jsx              # Main component
├── main.jsx             # Entry point
└── index.css            # Global styles

public/
└── index.html           # HTML template
```

## ⚙️ Konfigurasi API

Edit `src/api/client.js` untuk mengubah base URL API:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
```

Atau set environment variable:
```bash
VITE_API_URL=http://your-server.com npm run dev
```

## 📊 Endpoint API

Dashboard menggunakan endpoint dari `api.php`:

- `GET /api.php?action=getAllData&timeframe=1hour` - Real-time & history data
- `GET /api.php?action=getRangeDefinitions` - Definisi rentang
- `GET /api.php?action=getFuzzyRules` - Aturan fuzzy
- `POST /api.php?action=setStatus` - Kontrol relay/timer

## 🎨 Customization

### Tema & Warna
Edit `src/index.css` dan `tailwind.config.js`

### Refresh Interval
Di `src/App.jsx`, ubah nilai di `setInterval`:
```javascript
refreshIntervalRef.current = setInterval(() => {
  fetchData()
}, 15000) // 15 detik
```

### Timezone
Default timezone adalah `Asia/Jakarta`. Ubah di `src/App.jsx`:
```javascript
dayjs.tz.setDefault('Asia/Jakarta')
```

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM binding
- **axios** - HTTP client
- **chart.js** - Chart library
- **react-chartjs-2** - React wrapper untuk Chart.js
- **dayjs** - Date/time utility
- **tailwindcss** - CSS framework
- **vite** - Build tool

## 🔧 Development

### Format & Linting
```bash
# Belum ada setup, tambahkan sesuai kebutuhan
npm install -D eslint prettier
```

### Build untuk Production
```bash
npm run build
# Output di folder 'dist'
```

## 📝 Catatan

- Pastikan PHP backend (`api.php`) berjalan di server yang sama atau dikonfigurasi CORS
- Data charts di-cache untuk performance
- Auto-refresh otomatis setiap 15 detik
- Semua komponen mobile-responsive

## 📞 Support

Untuk pertanyaan atau issue, silakan check `api.php` dan `config.php` di root project.
