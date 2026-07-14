import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { bookingAPI } from '../services/api'
import '../styles/book-ride.css'

function BookRide() {
  const location = useLocation()
  const initialPickup = location.state?.pickup || ''
  const initialDropoff = location.state?.dropoff || ''

  const [formData, setFormData] = useState({
    pickupLocation: initialPickup,
    dropoffLocation: initialDropoff,
    rideType: 'economy',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const selectRideType = (type) => {
    setFormData((prev) => ({ ...prev, rideType: type }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const bookingData = {
        pickupLocation: {
          address: formData.pickupLocation,
          coordinates: {
            type: 'Point',
            coordinates: [77.2245, 28.5355],
          },
        },
        dropoffLocation: {
          address: formData.dropoffLocation,
          coordinates: {
            type: 'Point',
            coordinates: [77.2345, 28.5455],
          },
        },
        rideType: formData.rideType,
      }

      await bookingAPI.requestRide(bookingData)
      alert('🚕 Ride requested successfully! Matching you to a driver...')
      navigate('/ride-history')
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        setError('You are not logged in. Please login first.')
      } else if (status === 400) {
        setError(err.response?.data?.message || 'Invalid booking details.')
      } else if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running.')
      } else {
        setError(err.response?.data?.message || 'Failed to book ride. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getFareEstimate = () => {
    const { pickupLocation, dropoffLocation, rideType } = formData
    if (!pickupLocation || !dropoffLocation) return null

    const totalLen = pickupLocation.length + dropoffLocation.length
    const distance = parseFloat((3 + (totalLen % 12) + (totalLen % 5) / 2).toFixed(1))
    
    const rates = { economy: 10, premium: 15, shared: 7 }
    const rate = rates[rideType] || 10
    const base = 50
    const fare = Math.round(base + distance * rate)

    return { distance, fare }
  }

  const estimate = getFareEstimate()

  return (
    <div className="book-ride-container">
      <div className="booking-grid">
        
        {/* Left Column: Form Control */}
        <div className="booking-form-card">
          <div className="form-header">
            <h2>Book a Ride</h2>
            <p>Enter your details and choose your ride mode</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="booking-inputs-block">
              <div className="visual-connector">
                <div className="dot-circle-orange"></div>
                <div className="bar-line"></div>
                <div className="dot-square-orange"></div>
              </div>

              <div className="inputs-block">
                <div className="form-group-flat">
                  <label>Pickup location</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder="Where from?"
                    required
                    className="flat-location-input"
                  />
                </div>

                <div className="form-group-flat">
                  <label>Dropoff location</label>
                  <input
                    type="text"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    placeholder="Where to?"
                    required
                    className="flat-location-input"
                  />
                </div>
              </div>
            </div>

            {/* Premium Ride Selector Cards */}
            <div className="ride-selector-title">Select ride category</div>
            <div className="ride-cards-grid">
              
              <div 
                className={`ride-select-card ${formData.rideType === 'economy' ? 'active' : ''}`}
                onClick={() => selectRideType('economy')}
              >
                <span className="ride-card-icon">🚗</span>
                <div className="ride-card-details">
                  <h4>Cab-U Go</h4>
                  <p>Fast, cheap everyday rides</p>
                </div>
                <span className="ride-card-rate">₹10/km</span>
              </div>

              <div 
                className={`ride-select-card ${formData.rideType === 'premium' ? 'active' : ''}`}
                onClick={() => selectRideType('premium')}
              >
                <span className="ride-card-icon">✨</span>
                <div className="ride-card-details">
                  <h4>Premium</h4>
                  <p>Luxurious luxury sedans</p>
                </div>
                <span className="ride-card-rate">₹15/km</span>
              </div>

              <div 
                className={`ride-select-card ${formData.rideType === 'shared' ? 'active' : ''}`}
                onClick={() => selectRideType('shared')}
              >
                <span className="ride-card-icon">👥</span>
                <div className="ride-card-details">
                  <h4>Shared</h4>
                  <p>Save money by sharing rides</p>
                </div>
                <span className="ride-card-rate">₹7/km</span>
              </div>

            </div>

            {estimate && (
              <div className="premium-estimate-box">
                <div className="estimate-row">
                  <span>Calculated Distance</span>
                  <strong>{estimate.distance} km</strong>
                </div>
                <div className="estimate-row highlight">
                  <span>Guaranteed Price</span>
                  <strong>₹{estimate.fare}</strong>
                </div>
              </div>
            )}

            <button type="submit" className="btn-confirm-booking" disabled={loading}>
              {loading ? (
                <span className="booking-spinner-wrapper">
                  <div className="spinner-dot"></div>Matching you...
                </span>
              ) : (
                'Request Ride Now'
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic 3D Map Visual */}
        <div className="booking-visual-card">
          <div className="visual-map-container">
            <div className="grid-overlay"></div>
            
            {formData.pickupLocation && formData.dropoffLocation ? (
              <div className="active-route-visual">
                <div className="path-route-line"></div>
                <div className="pulsing-radar-marker start-point">
                  <div className="radar-glow"></div>
                  <span className="marker-label">A</span>
                </div>
                <div className="pulsing-radar-marker end-point">
                  <div className="radar-glow"></div>
                  <span className="marker-label">B</span>
                </div>
                <div className="moving-avatar-cab">🚕</div>
                <div className="visual-route-detail-card">
                  <span className="detail-title">Routing Match Connected</span>
                  <p>{formData.pickupLocation} ➔ {formData.dropoffLocation}</p>
                </div>
              </div>
            ) : (
              <div className="idle-map-state">
                <div className="map-globe-icon">🌐</div>
                <h3>Real-time GPS Simulator</h3>
                <p>Enter your pickup and dropoff addresses to calculate coordinates and request drivers on the map grid.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default BookRide
