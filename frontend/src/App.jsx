import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import AddVessel from './components/utils/addvessel'
import NewVoyage from './components/utils/addvoyage'
import EditVoyage from './components/utils/editvoyage'
import FleetDashboard from './pages/dashboard/fleetowner'
import TraderDashboard from './pages/dashboard/trader'
import CaptainDashboard from './pages/dashboard/captains'
import AddVessel from './components/utils/addvessel'

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
        <Route path="/addvessel" element={<AddVessel />} />
        <Route path="/newvoyage" element={<NewVoyage />} />
        <Route path="/editvoyage" element={<EditVoyage />} />
        <Route path="/approvevoyage" element={<ApproveVoyage />} />
      </Routes>
    </Router>
  )
}

export default App
