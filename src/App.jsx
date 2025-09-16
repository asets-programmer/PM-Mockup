import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import PreventiveMaintenanceDashboard from './dashboard/PageDashboard'
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PreventiveMaintenanceDashboard />} />
          <Route path="/dashboard" element={<PreventiveMaintenanceDashboard />} />
          <Route path="/equipment" element={<PageEquipment />} />
          <Route path="/notifications" element={<PageNotifications />} />
          <Route path="/process-flow" element={<PageProcessFlow />} />
          <Route path="/reports" element={<PageReports />} />
          <Route path="/schedule" element={<PageSchedule />} />
          <Route path="/settings" element={<PageSettings />} />
          <Route path="/team" element={<PageTeam />} />
          <Route path="/work-orders" element={<PageWorkOrders />} />
          <Route path="/task" element={<PageTeknisi />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
