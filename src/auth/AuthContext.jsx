import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const hasAccess = (requiredRole) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.role === requiredRole
  }

  const canAccessPage = (path) => {
    if (!user) return false
    
    // Admin can access everything
    if (user.role === 'admin') return true
    
    // Teknisi can only access equipment and task pages
    if (user.role === 'teknisi') {
      return path === '/equipment' || path === '/task' || path === '/dashboard'
    }
    
    return false
  }

  const value = {
    user,
    login,
    logout,
    hasAccess,
    canAccessPage,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
