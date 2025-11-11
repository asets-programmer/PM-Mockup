import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, canAccessPage, isLoading, hasAccess } = useAuth()
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

  // Check requiredRole if specified (supports array or single role)
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRequiredRole = allowedRoles.some(role => hasAccess(role) || user.role === role)
    
    if (!hasRequiredRole) {
      // Redirect to appropriate page based on role
      if (user.role === 'operator') {
        return <Navigate to="/app/notifications" replace />
      }
      if (user.role === 'technician' || user.role === 'teknisi') {
        return <Navigate to="/app/equipment" replace />
      }
      return <Navigate to="/app/dashboard" replace />
    }
  }

  if (!canAccessPage(location.pathname)) {
    // Redirect to appropriate page based on role
    if (user.role === 'operator') {
      return <Navigate to="/app/notifications" replace />
    }
    if (user.role === 'technician' || user.role === 'teknisi') {
      return <Navigate to="/app/equipment" replace />
    }
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
