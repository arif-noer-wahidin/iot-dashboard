import React, { useState } from 'react'

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  if (!isOpen) return null

  const submit = (e) => {
    e.preventDefault()
    onLogin(user.trim(), pass)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Masuk</h3>
        <div className="mb-3">
          <label className="text-xs text-gray-400">Username</label>
          <input className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600" value={user} onChange={e => setUser(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-400">Password</label>
          <input type="password" className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 font-semibold py-2 rounded">Masuk</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded">Batal</button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(LoginModal)
