import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import Vessel from './components/fleet/vessel'
import NewVoyage from './components/fleet/newvoyage'
import EditVoyage from './components/fleet/editvoyage'
import ApproveVoyage from './components/fleet/approvevoyage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vessel" element={<Vessel />} />
        <Route path="/newvoyage" element={<NewVoyage />} />
        <Route path="/editvoyage" element={<EditVoyage />} />
        <Route path="/approvevoyage" element={<ApproveVoyage />} />
      </Routes>
    </Router>
  )
}

export default App
