import React, { useState } from 'react'
import StoriLogo from '/assets/Stori.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../stori_demo/auth/AuthContext'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    if (username === 'abhstori' && password === 'password') {
      login({ username: 'abhstori', role: 'admin', name: 'Administrator' })
      navigate('/app/dashboard')
    } else if (username === 'teknisistori' && password === 'password') {
      login({ username: 'teknisistori', role: 'teknisi', name: 'Teknisi' })
      navigate('/app/dashboard')
    } else if (username === 'abhpertare' && password === 'password') {
      // Login untuk pertare menggunakan localStorage langsung
      const pertareUser = { username: 'abhpertare', role: 'admin', name: 'Administrator Pertare' }
      localStorage.setItem('pertare_user', JSON.stringify(pertareUser))
      navigate('/pertare/dashboard')
    } else if (username === 'teknisipertare' && password === 'password') {
      // Login untuk pertare menggunakan localStorage langsung
      const pertareUser = { username: 'teknisipertare', role: 'teknisi', name: 'Teknisi Pertare' }
      localStorage.setItem('pertare_user', JSON.stringify(pertareUser))
      navigate('/pertare/dashboard')
    } else {
      setError('Username atau password salah')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Logo/Header */}
          <div className="text-center mb-6 sm:mb-8">
            <img
              src={StoriLogo}
              alt="Stori"
              className="mx-auto h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover mb-3 sm:mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Preventive Maintenance</h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Silakan masuk ke akun Anda</p>
          </div>

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-sm sm:text-base"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-sm sm:text-base"
                placeholder="Masukkan password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Admin Stori:</strong> abhstori / password</div>
              <div><strong>Teknisi Stori:</strong> teknisistori / password</div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div><strong>Admin Pertare:</strong> abhpertare / password</div>
                <div><strong>Teknisi Pertare:</strong> teknisipertare / password</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
