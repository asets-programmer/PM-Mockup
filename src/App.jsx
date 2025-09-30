import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './auth/LoginPage'
import ProtectedRoute from './auth/ProtectedRoute'
import Dashboard from './dashboard/Dashboard'
import PageEquipment from './equipment/PageEquipment'
import PageNotifications from './notifications/PageNotifications'
import PageProcessFlow from './proses flow/PageProcessFlow'
import PageReports from './reports/PageReports'
import PageSchedule from './Schedule/PageSchedule'
import PageSettings from './Settings/PageSettings'
import PageTeam from './Team/PageTeam'
import PageWorkOrders from './work orders/PageWorkOrders'
import PageTeknisi from './task/PageTeknisi'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/equipment" 
        element={
          <ProtectedRoute>
            <PageEquipment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/task" 
        element={
          <ProtectedRoute>
            <PageTeknisi />
          </ProtectedRoute>
        } 
      />
      {/* Admin only routes */}
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageNotifications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/process-flow" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageProcessFlow />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageReports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/schedule" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageSchedule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageSettings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageTeam />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/work-orders" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PageWorkOrders />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App
