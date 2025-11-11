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
    
    // HQ Admin has access to everything
    if (user.role === 'hq_admin') return true
    
    // Manager has access to most things (except HQ admin features)
    if (user.role === 'manager') {
      return requiredRole !== 'hq_admin'
    }
    
    // Check exact role match
    return user.role === requiredRole
  }

  const canAccessPage = (path) => {
    if (!user) return false
    
    // HQ Admin can access everything
    if (user.role === 'hq_admin') return true
    
    // Manager can access most pages (full control)
    if (user.role === 'manager') {
      const allowedPaths = ['/app/dashboard', '/app/command-center', '/app/equipment', '/app/task', '/app/work-orders', '/app/notifications', '/app/reports', '/app/schedule', '/app/settings'];
      // Allow feature detail pages
      if (path.startsWith('/app/features/')) {
        return true;
      }
      return allowedPaths.includes(path) && path !== '/app/hq-analytics' // HQ Admin only
    }
    
    // Technician can access: dashboard, equipment, task, notifications (view only)
    if (user.role === 'technician') {
      return ['/app/dashboard', '/app/equipment', '/app/task', '/app/notifications'].includes(path)
    }
    
    // Operator can only access: dashboard, notifications (alerts only)
    if (user.role === 'operator') {
      return ['/app/dashboard', '/app/notifications'].includes(path)
    }
    
    // Legacy admin and teknisi
    if (user.role === 'admin') return true
    if (user.role === 'teknisi') {
      return path === '/app/equipment' || path === '/app/task' || path === '/app/dashboard'
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
