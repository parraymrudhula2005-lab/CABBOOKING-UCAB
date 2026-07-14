import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BookRide from './pages/BookRide'
import RideHistory from './pages/RideHistory'
import DriverRegister from './pages/DriverRegister'
import DriverDashboard from './pages/DriverDashboard'
import TrackRide from './pages/TrackRide'

function App() {
  const { token, loadToken } = useAuthStore()

  useEffect(() => {
    loadToken()
  }, [])

  // Helper: redirect to login if not authenticated
  const ProtectedRoute = ({ element }) =>
    token ? element : <Navigate to="/login" replace />

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard"        element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/book-ride"        element={<ProtectedRoute element={<BookRide />} />} />
        <Route path="/ride-history"     element={<ProtectedRoute element={<RideHistory />} />} />
        <Route path="/track-ride/:bookingId" element={<ProtectedRoute element={<TrackRide />} />} />
        <Route path="/driver-register"  element={<ProtectedRoute element={<DriverRegister />} />} />
        <Route path="/driver-dashboard" element={<ProtectedRoute element={<DriverDashboard />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
