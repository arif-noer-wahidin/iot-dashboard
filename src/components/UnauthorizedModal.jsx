import React from 'react'

const UnauthorizedModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Akses Dibatasi</h2>
        <p className="text-gray-300 mb-6">Anda perlu masuk untuk melakukan perubahan (mis. mengubah timer, kontrol relay, atau menyimpan pengaturan). Silakan masuk untuk melanjutkan.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-gray-200">Tutup</button>
          <button onClick={onLogin} className="px-4 py-2 rounded bg-green-500 text-gray-900 font-semibold">Masuk</button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(UnauthorizedModal)
