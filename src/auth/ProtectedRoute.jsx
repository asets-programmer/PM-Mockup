import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, canAccessPage, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!canAccessPage(location.pathname)) {
    // Redirect to appropriate page based on role
    if (user.role === 'teknisi') {
      return <Navigate to="/equipment" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
