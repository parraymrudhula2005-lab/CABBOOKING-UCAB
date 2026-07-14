import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { driverAPI, bookingAPI } from '../services/api'
import '../styles/driver-dashboard.css'

function DriverDashboard() {
  const [driverData, setDriverData] = useState(null)
  const [availableRides, setAvailableRides] = useState([])
  const [activeRide, setActiveRide] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pollingInterval, setPollingInterval] = useState(null)
  const [simInterval, setSimInterval] = useState(null)

  // Fetch driver profile on mount
  useEffect(() => {
    fetchDriverData()
    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
      if (simInterval) clearInterval(simInterval)
    }
  }, [])

  // Poll for available and active rides when online status changes
  useEffect(() => {
    if (isOnline) {
      fetchAvailableRides()
      fetchDriverRides() // check if already has an in-progress ride
      
      const interval = setInterval(() => {
        fetchAvailableRides()
        fetchDriverRides()
      }, 4000)

      setPollingInterval(interval)
      return () => clearInterval(interval)
    } else {
      if (pollingInterval) clearInterval(pollingInterval)
      setAvailableRides([])
    }
  }, [isOnline])

  // Simulate GPS coordinates updating on server
  useEffect(() => {
    if (!activeRide) {
      if (simInterval) clearInterval(simInterval)
      return
    }

    // Only simulate coordinate updates when moving
    if (activeRide.status === 'on_the_way' || activeRide.status === 'in_progress') {
      let stepCount = 0
      const maxSteps = 10
      
      const startCoords = activeRide.status === 'on_the_way' 
        ? [77.2145, 28.5255] // Driver start location
        : activeRide.pickupLocation?.coordinates?.coordinates || [77.2245, 28.5355]
      
      const endCoords = activeRide.status === 'on_the_way'
        ? activeRide.pickupLocation?.coordinates?.coordinates || [77.2245, 28.5355]
        : activeRide.dropoffLocation?.coordinates?.coordinates || [77.2345, 28.5455]

      const interval = setInterval(async () => {
        if (stepCount >= maxSteps) {
          clearInterval(interval)
          return
        }
        
        stepCount++
        const progress = stepCount / maxSteps
        const currentLng = startCoords[0] + (endCoords[0] - startCoords[0]) * progress
        const currentLat = startCoords[1] + (endCoords[1] - startCoords[1]) * progress

        try {
          // Push GPS update to server
          await driverAPI.updateLocation({ latitude: currentLat, longitude: currentLng })
        } catch (err) {
          console.error('GPS sync failed:', err)
        }
      }, 2000)

      setSimInterval(interval)
      return () => clearInterval(interval)
    }
  }, [activeRide?.status, activeRide?._id])

  const fetchDriverData = async () => {
    try {
      const response = await driverAPI.getProfile()
      setDriverData(response.data.driver)
      setIsOnline(response.data.driver.isOnline)
      setLoading(false)
    } catch (err) {
      setError('Failed to load driver profile. Make sure you are registered as a driver.')
      setLoading(false)
    }
  }

  // Fetch unassigned requested rides
  const fetchAvailableRides = async () => {
    try {
      const response = await bookingAPI.getAvailableBookings()
      setAvailableRides(response.data.bookings || [])
    } catch (err) {
      console.error('Failed to load available rides:', err)
    }
  }

  // Fetch driver's active ride
  const fetchDriverRides = async () => {
    try {
      const response = await bookingAPI.getDriverBookings()
      const rides = response.data.bookings || []
      // Find ride that is active (not completed or cancelled)
      const currentActive = rides.find(
        (r) => r.status !== 'completed' && r.status !== 'cancelled'
      )
      setActiveRide(currentActive || null)
    } catch (err) {
      console.error('Failed to load driver active ride:', err)
    }
  }

  const handleToggleOnline = async () => {
    try {
      const res = await driverAPI.toggleOnlineStatus()
      setIsOnline(res.data.isOnline)
    } catch (err) {
      console.error('Failed to toggle online status:', err)
    }
  }

  const handleAcceptRide = async (bookingId) => {
    try {
      await bookingAPI.acceptRide(bookingId)
      alert('🚕 Ride accepted! Approaching pickup point.')
      fetchDriverRides()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept ride.')
    }
  }

  const handleUpdateStatus = async (status) => {
    try {
      await bookingAPI.updateStatus(activeRide._id, status)
      // Refresh local state immediately
      setActiveRide(prev => ({ ...prev, status }))
      if (status === 'completed') {
        alert('Destination reached! Awaiting passenger payment.')
      }
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  if (loading) return <div className="container"><p>Loading driver profile...</p></div>

  return (
    <div className="driver-dashboard">
      <div className="container">
        <h1>🚕 Driver Dashboard</h1>

        {error && (
          <div className="error-card">
            <p>{error}</p>
            <Link to="/driver-register" className="btn btn-primary">Register Now</Link>
          </div>
        )}

        {driverData && (
          <div className="dashboard-grid-driver">
            {/* Status Panel Card */}
            <div className="status-card">
              <h2>🟢 Duty Status</h2>
              <p className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </p>
              <div className="action-buttons-row">
                <button 
                  className={`btn ${isOnline ? 'btn-danger' : 'btn-success'}`} 
                  onClick={handleToggleOnline}
                >
                  {isOnline ? '🔴 Go Offline' : '🟢 Go Online'}
                </button>
              </div>
            </div>

            {/* Profile detail details */}
            <div className="driver-info-card">
              <h2>👤 Vehicle & Earnings</h2>
              <div className="info-grid">
                <p><strong>License:</strong> {driverData.licenseNumber}</p>
                <p><strong>Vehicle:</strong> {driverData.vehicle?.make} {driverData.vehicle?.model} ({driverData.vehicle?.color})</p>
                <p><strong>Plate No:</strong> <span className="mono">{driverData.vehicle?.licensePlate}</span></p>
                <p><strong>Class:</strong> <span className="tag-vehicle">{driverData.vehicle?.type}</span></p>
                <p><strong>Rating:</strong> ⭐ {driverData.rating || 5} / 5</p>
                <p><strong>Total Earnings:</strong> ₹{driverData.totalEarnings || 0}</p>
              </div>
            </div>

            {/* Active/Assigned Ride Controller */}
            {activeRide ? (
              <div className="active-controller-card">
                <h2>📍 Active Job Handler</h2>
                <div className="ride-detail-panel">
                  <div className="rider-bio">
                    <span className="rider-avatar">👤</span>
                    <div>
                      <h4>{activeRide.userId?.name}</h4>
                      <p>{activeRide.userId?.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                  
                  <div className="trip-locations">
                    <p><strong>From:</strong> {activeRide.pickupLocation?.address}</p>
                    <p><strong>To:</strong> {activeRide.dropoffLocation?.address}</p>
                    <p><strong>Class Fare:</strong> ₹{activeRide.fare?.finalFare || 120} ({activeRide.rideType})</p>
                    <p><strong>Current Status:</strong> <span className="status-label-active">{activeRide.status}</span></p>
                  </div>

                  <div className="control-steps">
                    {activeRide.status === 'accepted' && (
                      <button className="btn btn-primary btn-block" onClick={() => handleUpdateStatus('on_the_way')}>
                        🚀 Start Approaching Pickup (On the way)
                      </button>
                    )}
                    
                    {activeRide.status === 'on_the_way' && (
                      <button className="btn btn-warning btn-block animate-pulse" onClick={() => handleUpdateStatus('arrived')}>
                        📍 Arrived at Pickup
                      </button>
                    )}

                    {activeRide.status === 'arrived' && (
                      <button className="btn btn-success btn-block" onClick={() => handleUpdateStatus('in_progress')}>
                        🚗 Boarded & Start Ride
                      </button>
                    )}

                    {activeRide.status === 'in_progress' && (
                      <button className="btn btn-danger btn-block" onClick={() => handleUpdateStatus('completed')}>
                        🏁 Arrive at Destination (End Ride)
                      </button>
                    )}

                    {activeRide.status === 'completed' && (
                      <div className="awaiting-payment">
                        <div className="banking-spinner small"></div>
                        <p>Awaiting rider payment authorization...</p>
                        <button className="btn btn-secondary btn-block" onClick={fetchDriverRides}>
                          🔄 Check Payment Status
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Available Broadcast List when Online */
              <div className="active-rides">
                <h2>📢 Available Broadcast Rides</h2>
                {!isOnline ? (
                  <p className="hint-text">Go online to receive nearby passenger bookings.</p>
                ) : availableRides.length === 0 ? (
                  <p className="hint-text">Searching for ride requests in your area...</p>
                ) : (
                  <div className="available-list">
                    {availableRides.map((ride) => (
                      <div key={ride._id} className="available-ride-card">
                        <div className="ride-card-header">
                          <span className="badge-ride-type">{ride.rideType}</span>
                          <span className="price-tag">₹{ride.fare?.finalFare || 120}</span>
                        </div>
                        <div className="ride-addresses-mini">
                          <p><strong>From:</strong> {ride.pickupLocation?.address}</p>
                          <p><strong>To:</strong> {ride.dropoffLocation?.address}</p>
                          <p><strong>Passenger:</strong> {ride.userId?.name}</p>
                        </div>
                        <button className="btn btn-success btn-block" onClick={() => handleAcceptRide(ride._id)}>
                          🚕 Accept Ride
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverDashboard
