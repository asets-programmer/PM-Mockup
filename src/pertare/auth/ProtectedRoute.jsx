import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate page based on role
    if (user.role === 'teknisi') {
      return <Navigate to="/pertare/task" replace />
    }
    return <Navigate to="/pertare/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
