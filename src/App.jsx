import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './stori_demo/auth/AuthContext'
import { AuthProvider as PertareAuthProvider, useAuth as usePertareAuth } from './pertare/auth/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import LoginPage from './dashboard/LoginPage'
import ProtectedRoute from './stori_demo/auth/ProtectedRoute'
import PertareProtectedRoute from './pertare/auth/ProtectedRoute'

// Lazy load components for code splitting
const PropertyDashboard = React.lazy(() => import('./dashboard/dash'))
const AIDocumentGenerator = React.lazy(() => import('./dashboard/AI Document Generator'))
const AIMaintenanceConsultant = React.lazy(() => import('./dashboard/AIMaintenanceConsultant'))
const CameraBrandDetection = React.lazy(() => import('./dashboard/CameraBrandDetection'))
const Dashboard = React.lazy(() => import('./stori_demo/dashboard_stori/Dashboard'))
const CommandCenterDashboard = React.lazy(() => import('./stori_demo/dashboard_stori/CommandCenterDashboard'))
const CommandCenterDemo = React.lazy(() => import('./stori_demo/dashboard_stori/CommandCenterDemo'))
const SmartDripAI = React.lazy(() => import('./stori_demo/dashboard_stori/features/SmartDripAI'))
const TouchscreenHealth = React.lazy(() => import('./stori_demo/dashboard_stori/features/TouchscreenHealth'))
const ThermalWatch = React.lazy(() => import('./stori_demo/dashboard_stori/features/ThermalWatch'))
const Sentinel = React.lazy(() => import('./stori_demo/dashboard_stori/features/Sentinel'))
const PageEquipment = React.lazy(() => import('./stori_demo/equipment/PageEquipment'))
const PageNotifications = React.lazy(() => import('./stori_demo/notifications/PageNotifications'))
const PageProcessFlow = React.lazy(() => import('./stori_demo/proses flow/PageProcessFlow'))
const PageReports = React.lazy(() => import('./stori_demo/reports/PageReports'))
const PageSchedule = React.lazy(() => import('./stori_demo/Schedule/PageSchedule'))
const PageSettings = React.lazy(() => import('./stori_demo/Settings/PageSettings'))
const PageTeam = React.lazy(() => import('./stori_demo/Team/PageTeam'))
const PageWorkOrders = React.lazy(() => import('./stori_demo/work orders/PageWorkOrders'))
const PageTeknisi = React.lazy(() => import('./stori_demo/task/PageTeknisi'))

// Pertare components
const PertareDashboard = React.lazy(() => import('./pertare/dashboard_pertare/Dashboard'))
const PertarePageEquipment = React.lazy(() => import('./pertare/equipment/PageEquipment'))
const PertarePageNotifications = React.lazy(() => import('./pertare/notifications/PageNotifications'))
const PertarePageProcessFlow = React.lazy(() => import('./pertare/proses flow/PageProcessFlow'))
const PertarePageReports = React.lazy(() => import('./pertare/reports/PageReports'))
const PertarePageSchedule = React.lazy(() => import('./pertare/Schedule/PageSchedule'))
const PertarePageSettings = React.lazy(() => import('./pertare/Settings/PageSettings'))
const PertarePageTeam = React.lazy(() => import('./pertare/Team/PageTeam'))
const PertarePageWorkOrders = React.lazy(() => import('./pertare/work orders/PageWorkOrders'))
const PertarePageTeknisi = React.lazy(() => import('./pertare/task/PageTeknisi'))
const PertarePageMaintenanceReport = React.lazy(() => import('./pertare/maintenance-report/PageMaintenanceReport'))
const PertarePageUnitResponsibility = React.lazy(() => import('./pertare/unit-responsibility/PageUnitResponsibility'))

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={<PropertyDashboard />}
        />
        <Route 
          path="/ai-document-generator" 
          element={<AIDocumentGenerator />}
        />
        <Route 
          path="/ai-maintenance-consultant" 
          element={<AIMaintenanceConsultant />}
        />
        <Route 
          path="/camera-brand-detection" 
          element={<CameraBrandDetection />}
        />
        {/* Demo Route - No login required */}
        <Route 
          path="/app/demo" 
          element={<CommandCenterDemo />}
        />
        <Route 
          path="/app" 
          element={
            user ? <Navigate to="/app/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/app/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
          <Route
            path="/app/command-center" 
            element={
              <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
                <CommandCenterDashboard />
              </ProtectedRoute>
            }
          />
        {/* Feature Detail Pages */}
        <Route
          path="/app/features/smart-drip" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <SmartDripAI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/features/touchscreen" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <TouchscreenHealth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/features/thermalwatch" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <ThermalWatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/features/sentinel" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <Sentinel />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/app/equipment" 
          element={
            <ProtectedRoute>
              <PageEquipment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/task" 
          element={
            <ProtectedRoute>
              <PageTeknisi />
            </ProtectedRoute>
          } 
        />
        {/* Notifications - All roles (but different access levels) */}
        <Route 
          path="/app/notifications" 
          element={
            <ProtectedRoute>
              <PageNotifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/process-flow" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PageProcessFlow />
            </ProtectedRoute>
          } 
        />
        {/* Reports - Manager and HQ Admin only */}
        <Route 
          path="/app/reports" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <PageReports />
            </ProtectedRoute>
          } 
        />
        {/* Schedule - Manager and HQ Admin only */}
        <Route 
          path="/app/schedule" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <PageSchedule />
            </ProtectedRoute>
          } 
        />
        {/* Settings - Manager and HQ Admin only */}
        <Route 
          path="/app/settings" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <PageSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/team" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <PageTeam />
            </ProtectedRoute>
          } 
        />
        {/* Work Orders - Manager and HQ Admin only */}
        <Route 
          path="/app/work-orders" 
          element={
            <ProtectedRoute requiredRole={['manager', 'hq_admin']}>
              <PageWorkOrders />
            </ProtectedRoute>
          } 
        />
        {/* HQ Analytics - HQ Admin only */}
        <Route 
          path="/app/hq-analytics" 
          element={
            <ProtectedRoute requiredRole={['hq_admin']}>
              <div className="p-6">
                <h1 className="text-2xl font-bold">HQ Analytics</h1>
                <p className="text-gray-600 mt-2">Multi-SPBU analytics dashboard (Coming Soon)</p>
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Pertare Routes */}
        <Route 
          path="/pertare/*" 
          element={<PertareApp />}
        />
      </Routes>
    </Suspense>
  )
}

const PertareApp = () => {
  return (
    <PertareAuthProvider>
      <PertareRoutes />
    </PertareAuthProvider>
  )
}

const PertareRoutes = () => {
  const { user } = usePertareAuth()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/pertare/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PertareProtectedRoute>
              <PertareDashboard />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/equipment" 
          element={
            <PertareProtectedRoute>
              <PertarePageEquipment />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/task" 
          element={
            <PertareProtectedRoute>
              <PertarePageTeknisi />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/maintenance-report" 
          element={
            <PertareProtectedRoute requiredRole="teknisi">
              <PertarePageMaintenanceReport />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/unit-responsibility" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageUnitResponsibility />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <PertareProtectedRoute>
              <PertarePageNotifications />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/process-flow" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageProcessFlow />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageReports />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageSchedule />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageSettings />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/team" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageTeam />
            </PertareProtectedRoute>
          } 
        />
        <Route 
          path="/work-orders" 
          element={
            <PertareProtectedRoute requiredRole="admin">
              <PertarePageWorkOrders />
            </PertareProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  )
}

export default App
