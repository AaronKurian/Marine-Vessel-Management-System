import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import FleetDashboard from './pages/dashboard/fleetowner'
import TraderDashboard from './pages/dashboard/trader'
import CaptainDashboard from './pages/dashboard/captains'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
       <Route path="/dashboard/fleetowner" element={<FleetDashboard />} />
        <Route path="/dashboard/trader" element={<TraderDashboard />} />
       <Route path="/dashboard/captain" element={<CaptainDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
