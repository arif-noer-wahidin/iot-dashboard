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
# IoT Dashboard — Aquascape (React + Vite)

Dashboard front-end untuk memantau dan mengendalikan sistem aquascape (sensors: suhu, pH, TDS). Aplikasi dibangun dengan React + Vite dan menggunakan Tailwind CSS.

Catatan penting: repository ini telah diubah agar front-end tidak lagi bergantung pada file PHP lokal. Semua panggilan API sekarang diasumsikan menuju REST-style backend yang dikonfigurasi lewat `VITE_API_URL`.

## Ringkasan

- Tujuan: antarmuka real-time untuk sensor, kontrol relay, timer, dan rekomendasi fuzzy.
- Tech stack: React, Vite, Tailwind CSS, Chart.js, Axios.

## Fitur Utama

- Monitoring real-time sensor (suhu, pH, TDS)
- Kontrol perangkat (relay ON/OFF) dan timer
- Grafik riwayat data
- Rekomendasi berbasis fuzzy rules
- Responsive UI dan tema gelap

## Prasyarat

- Node.js 16+ dan npm (atau yarn)
- Backend API (REST) yang tersedia — konfigurasi lewat `VITE_API_URL`

## Instalasi & Menjalankan (Development)

1. Pasang dependency

```bash
npm install
```

2. Jalankan dev server

```bash
npm run dev
```

3. Buka alamat yang ditunjukkan Vite (mis. `http://localhost:5173`)

Jika backend API berjalan di alamat terpisah, set environment variable sebelum menjalankan:

```bash
VITE_API_URL=https://api.example.com npm run dev
```

## Build untuk Production

```bash
npm run build
npm run preview    # opsional
```

Output build berada di `dist`.

## Struktur Proyek (ringkasan)

```
.
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── api/
│   │   ├── client.js
│   │   ├── googleScript.js
│   │   └── googleScriptClient.js
│   └── components/
└── README.md
```

## Konfigurasi API (client)

Front-end menggunakan `src/api/client.js` yang membaca base URL dari environment:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
```

Set `VITE_API_URL` untuk menunjuk ke backend REST Anda (contoh: `https://api.example.com`).

## Endpoint REST yang Disarankan (convention)

Contoh endpoint yang front-end saat ini panggil melalui `src/api/client.js`:

- `GET /realtime?timeframe=1hour&limit=100` — realtime singkat
- `GET /history?timeframe=1day&limit=8640` — data riwayat
- `GET /range-definitions` — definisi rentang sensor
- `GET /fuzzy-rules` — aturan fuzzy
- `POST /status` — kirim perintah pengendalian (body JSON)

Implementasi backend dapat menyesuaikan path ini; yang penting adalah base URL dikonfigurasikan lewat `VITE_API_URL`.

## Migrasi dari PHP lokal

- Jika Anda sebelumnya menggunakan `api.php`/`config.php`, pindahkan logika ke backend REST (mis. Node/PHP/Go) yang menyediakan endpoint sesuai daftar di atas.
- Pastikan backend mengembalikan JSON dan men-support CORS bila front-end dan backend berada di domain berbeda.

## Penjelasan Komponen Utama

- `App.jsx` — mengelola lifecycle, polling data, dan state utama.
- `SensorCard.jsx`, `HistoryChart.jsx`, `DeviceControl.jsx`, dsb. — UI components.

## Troubleshooting

- Tidak ada data? Pastikan `VITE_API_URL` benar dan backend mengembalikan JSON.
- Masalah CORS? Tambahkan header CORS di backend.
- Error pada POST `/status`? Pastikan payload JSON dan header `Content-Type: application/json`.

## Kontribusi

1. Fork repo
2. Buat branch: `git checkout -b feature/name`
3. Commit & PR

## Lisensi

Tambahkan file `LICENSE` jika ingin menentukan lisensi publik.

---

Jika ingin, saya bisa: menyesuaikan `src/api/client.js` untuk path lain, menambahkan contoh `.env`, atau membuat skrip deploy/CI.
