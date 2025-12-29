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
# IoT Dashboard — Aquascape (React + Vite)

Versi front-end dashboard untuk memantau dan mengendalikan sistem aquascape (IoT). Aplikasi dibangun dengan React, Vite, dan Tailwind CSS; berkomunikasi dengan backend PHP (`api.php`) untuk data sensor dan kontrol perangkat.

## Ringkasan

- Tujuan: Menyediakan antarmuka real-time untuk membaca sensor (suhu, pH, TDS), mengontrol relay, melihat riwayat, dan memberi rekomendasi berbasis fuzzy logic.
- Tech stack: React, Vite, Tailwind CSS, Chart.js, Axios.

## Fitur Utama

- Monitoring real-time sensor (mis. suhu, pH, TDS)
- Kontrol perangkat (relay ON/OFF) dan timer
- Visualisasi riwayat data dengan grafik
- Sistem rekomendasi sederhana (fuzzy rules)
- Responsive UI dan tema gelap
- Konfigurasi API via environment variable

## Prasyarat

- Node.js 16+ dan npm (atau yarn)
- PHP backend (file `api.php`) berjalan untuk penyediaan data

## Instalasi & Menjalankan (Development)

1. Pasang dependency

```bash
npm install
```

2. Jalankan dev server

```bash
npm run dev
```

3. Buka `http://localhost:5173` (atau alamat yang ditampilkan Vite)

Catatan: Jika backend API berada di server terpisah, set `VITE_API_URL` sebelum menjalankan:

```bash
VITE_API_URL=https://api.example.com npm run dev
```

## Build untuk Production

```bash
npm run build
npm run preview    # opsional: preview hasil build
```

Output build ada di folder `dist`.

## Struktur Proyek (ringkasan)

```
.
├── api.php                 # Endpoint PHP sederhana (backend)
├── config.php              # Konfigurasi backend (jika ada)
├── index.html              # Template HTML
├── package.json
├── src/
│   ├── App.jsx             # Komponen utama
│   ├── main.jsx            # Entry point React
│   ├── index.css           # Global styles / Tailwind imports
│   ├── api/
│   │   ├── client.js       # Axios client / helper fetch
│   │   └── googleScriptClient.js
│   └── components/         # Komponen UI
│       ├── AdminPanel.jsx
│       ├── DeviceControl.jsx
│       ├── SensorCard.jsx
│       ├── HistoryChart.jsx
│       ├── FuzzyRules.jsx
│       ├── RangeDefinitions.jsx
│       ├── RecommendationCard.jsx
│       ├── TimerControl.jsx
│       └── Skeleton.jsx
└── README.md
```

## Konfigurasi API (client)

Default base URL API didefinisikan di `src/api/client.js`:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
```

Atur `VITE_API_URL` pada environment untuk menunjuk ke backend jika tidak satu host dengan front-end.

## Endpoint yang Digunakan

Berikut endpoint yang umumnya dipanggil oleh front-end (implementasi ada di `api.php`):

- `GET /api.php?action=getAllData&timeframe=...` — ambil data sensor real-time dan riwayat
- `GET /api.php?action=getRangeDefinitions` — ambil definisi rentang sensor
- `GET /api.php?action=getFuzzyRules` — ambil aturan fuzzy
- `POST /api.php?action=setStatus` — kirim perintah kontrol (relay / timer)

Catatan: Sesuaikan parameter `timeframe` dan body request sesuai implementasi backend.

## Environment Variables

- `VITE_API_URL` — base URL API untuk development/production

Tambahkan ke `.env` (jika diperlukan):

```
VITE_API_URL=https://api.example.com
```

## Penjelasan Komponen Utama

- `App.jsx` — Mengelola lifecycle aplikasi, polling data, dan state global sederhana.
- `SensorCard.jsx` — Menampilkan nilai sensor dan status
- `DeviceControl.jsx` — UI untuk mengendalikan relay dan timer
- `HistoryChart.jsx` — Menampilkan grafik riwayat sensor menggunakan Chart.js
- `FuzzyRules.jsx` dan `RecommendationCard.jsx` — Menampilkan aturan dan rekomendasi

Untuk memahami alur data: `App.jsx` memanggil `src/api/client.js` → endpoint PHP → menerima JSON → meneruskan ke komponen.

## Kustomisasi & Pengaturan

- Ubah interval polling di `App.jsx` (default 15000 ms)
- Tema dan warna diatur via Tailwind (`tailwind.config.js` dan `index.css`)
- Mengubah logika rekomendasi: edit `src/components/FuzzyRules.jsx`

## Deployment

- Build (`npm run build`) lalu deploy isi folder `dist` ke hosting static (Netlify, Vercel, atau server biasa).
- Pastikan backend (`api.php`) dapat diakses oleh front-end (CORS atau domain sama).

## Troubleshooting

- Tidak ada data? Pastikan `api.php` mengembalikan JSON valid dan `VITE_API_URL` benar.
- Masalah CORS? Tambahkan header CORS di backend PHP.
- Chart tidak muncul? Cek struktur data yang dikirim ke Chart.js.

## Kontribusi

1. Fork repo
2. Buat branch fitur: `git checkout -b feature/name`
3. Commit perubahan dan buat PR

Silakan buka issue jika menemukan bug atau ide perbaikan.

## Lisensi

Project ini tidak menyertakan lisensi khusus. Tambahkan `LICENSE` jika ingin membuka lisensi.

## Kontak

Untuk pertanyaan lebih lanjut, buka file `api.php`/`config.php` atau buat issue di repository.

---

Terima kasih telah menggunakan IoT Dashboard ini. Jika Anda mau, saya bisa bantu menambahkan langkah deploy otomatis atau CI.
