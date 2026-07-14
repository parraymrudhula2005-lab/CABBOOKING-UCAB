import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingAPI } from '../services/api'
import '../styles/track-ride.css'

function TrackRide() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusTimer, setStatusTimer] = useState(null)

  // Simulation states
  const [simLocation, setSimLocation] = useState(0) // Percentage progress along route
  const [showPhonePe, setShowPhonePe] = useState(false)
  const [upiPin, setUpiPin] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  
  // Rating states
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  // Leaflet Live Map states
  const [mapLoaded, setMapLoaded] = useState(false)
  const [leafletInstance, setLeafletInstance] = useState(null)
  const [carMarkerInstance, setCarMarkerInstance] = useState(null)
  const [pickupLatLngState, setPickupLatLngState] = useState(null)
  const [dropoffLatLngState, setDropoffLatLngState] = useState(null)

  // Inject Leaflet CDN Assets dynamically
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.id = 'leaflet-css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.id = 'leaflet-js'
    script.async = true
    script.onload = () => {
      setMapLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      const existingLink = document.getElementById('leaflet-css')
      const existingScript = document.getElementById('leaflet-js')
      if (existingLink) existingLink.remove()
      if (existingScript) existingScript.remove()
    }
  }, [])

  // Fetch Booking status
  const fetchBookingStatus = async () => {
    try {
      const response = await bookingAPI.getBooking(bookingId)
      const data = response.data.booking
      setBooking(data)
      
      // If payment is already done and status is completed, show rating
      if (data.status === 'completed' && !data.rating?.driverRating) {
        setShowRating(true)
      }
      
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch ride status.')
      setLoading(false)
    }
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!booking || !mapLoaded) return

    let pCoords = booking.pickupLocation?.coordinates?.coordinates || [77.2245, 28.5355]
    let dCoords = booking.dropoffLocation?.coordinates?.coordinates || [77.2345, 28.5455]

    const pickupLatLng = [pCoords[1], pCoords[0]]
    const dropoffLatLng = [dCoords[1], dCoords[0]]
    setPickupLatLngState(pickupLatLng)
    setDropoffLatLngState(dropoffLatLng)

    const container = document.getElementById('live-leaflet-map')
    if (!container) return

    const L = window.L
    const map = L.map('live-leaflet-map', { zoomControl: false }).setView(pickupLatLng, 13)
    setLeafletInstance(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const pickupIcon = L.divIcon({
      html: '<div style="font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))">📍</div>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      className: 'custom-map-icon'
    })

    const dropoffIcon = L.divIcon({
      html: '<div style="font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🏁</div>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      className: 'custom-map-icon'
    })

    const carIcon = L.divIcon({
      html: '<div style="font-size: 32px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); transition: transform 0.25s ease-out;">🚕</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: 'custom-map-icon'
    })

    L.marker(pickupLatLng, { icon: pickupIcon }).addTo(map).bindPopup('Pickup Location')
    L.marker(dropoffLatLng, { icon: dropoffIcon }).addTo(map).bindPopup('Dropoff Location')

    L.polyline([pickupLatLng, dropoffLatLng], {
      color: '#000000',
      weight: 4,
      dashArray: '8, 12',
      opacity: 0.7
    }).addTo(map)

    const carMarker = L.marker(pickupLatLng, { icon: carIcon }).addTo(map)
    setCarMarkerInstance(carMarker)

    map.fitBounds([pickupLatLng, dropoffLatLng], { padding: [50, 50] })

    return () => {
      map.remove()
    }
  }, [booking?._id, mapLoaded])

  // Animate Car Marker movement along route coordinates
  useEffect(() => {
    if (!carMarkerInstance || !pickupLatLngState || !dropoffLatLngState) return

    const lat = pickupLatLngState[0] + (dropoffLatLngState[0] - pickupLatLngState[0]) * (simLocation / 100)
    const lng = pickupLatLngState[1] + (dropoffLatLngState[1] - pickupLatLngState[1]) * (simLocation / 100)
    
    carMarkerInstance.setLatLng([lat, lng])
  }, [simLocation, carMarkerInstance, pickupLatLngState, dropoffLatLngState])

  // Initial load & Polling
  useEffect(() => {
    fetchBookingStatus()

    // Poll every 3 seconds for updates from driver side
    const timer = setInterval(() => {
      fetchBookingStatus()
    }, 3000)

    setStatusTimer(timer)
    return () => clearInterval(timer)
  }, [bookingId])

  // Coordinate simulation along route
  useEffect(() => {
    if (!booking) return

    let interval
    if (booking.status === 'on_the_way') {
      // Simulate moving to pickup
      interval = setInterval(() => {
        setSimLocation((prev) => {
          if (prev >= 45) return 45 // Wait near pickup
          return prev + 1.5
        })
      }, 500)
    } else if (booking.status === 'arrived') {
      setSimLocation(50) // Exactly at pickup
    } else if (booking.status === 'in_progress') {
      // Simulate moving to destination
      interval = setInterval(() => {
        setSimLocation((prev) => {
          if (prev < 50) return 50
          if (prev >= 98) return 98 // Near destination
          return prev + 2
        })
      }, 500)
    } else if (booking.status === 'completed') {
      setSimLocation(100) // At destination
    } else {
      setSimLocation(0)
    }

    return () => clearInterval(interval)
  }, [booking?.status])

  // PhonePe Keypad Handler
  const handleKeypadPress = (val) => {
    if (val === 'delete') {
      setUpiPin(upiPin.slice(0, -1))
    } else if (upiPin.length < 6) {
      setUpiPin(upiPin + val)
    }
  }

  // Handle Payment Submit
  const handlePaymentSubmit = async () => {
    if (upiPin.length < 4) {
      alert('Please enter a valid UPI PIN')
      return
    }
    setPaymentLoading(true)

    // Simulate Network Request to PhonePe Servers
    setTimeout(async () => {
      try {
        await bookingAPI.payRide(bookingId, 'wallet')
        setPaymentLoading(false)
        setPaymentSuccess(true)
        
        // After 2.5s success visual screen, trigger rating dialog
        setTimeout(() => {
          setShowPhonePe(false)
          setShowRating(true)
        }, 2500)
      } catch (err) {
        console.error(err)
        alert('Payment verification failed. Please try again.')
        setPaymentLoading(false)
      }
    }, 2000)
  }

  // Handle Rating Submit
  const handleRatingSubmit = async (e) => {
    e.preventDefault()
    setRatingSubmitting(true)
    try {
      await bookingAPI.completeRide(bookingId, rating, review)
      alert('Thank you for your rating!')
      navigate('/ride-history')
    } catch (err) {
      console.error(err)
      alert('Failed to submit review. Redirecting to history.')
      navigate('/ride-history')
    } finally {
      setRatingSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="track-ride-loading">
        <div className="spinner"></div>
        <p>Connecting to Live GPS satellites...</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container">
        <div className="error-card">
          <h2>⚠️ Tracking Error</h2>
          <p>{error || 'Booking session details not found.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/ride-history')}>
            Back to Ride History
          </button>
        </div>
      </div>
    )
  }

  // Status mapping text and style colors
  const statusConfig = {
    requested: { text: 'Waiting for Driver...', color: '#ffc107', step: 1 },
    accepted: { text: 'Driver Confirmed!', color: '#17a2b8', step: 2 },
    on_the_way: { text: 'Driver is on the way', color: '#007bff', step: 3 },
    arrived: { text: 'Driver arrived at Pickup!', color: '#28a745', step: 4 },
    in_progress: { text: 'Ride in progress...', color: '#6f42c1', step: 5 },
    completed: { text: 'Arrived at Destination!', color: '#28a745', step: 6 },
    cancelled: { text: 'Ride Cancelled', color: '#dc3545', step: 0 }
  }

  const currentStatus = statusConfig[booking.status] || { text: booking.status, color: '#333', step: 0 }
  const fareAmount = booking.fare?.finalFare || 150

  return (
    <div className="track-ride">
      <div className="container">
        {/* Header Dashboard Navigation info */}
        <div className="header-card">
          <div className="status-header">
            <span className="back-link" onClick={() => navigate('/ride-history')}>← Back</span>
            <h2>🚕 Ride Tracker</h2>
            <span className="live-badge" style={{ backgroundColor: currentStatus.color }}>
              {currentStatus.text}
            </span>
          </div>
          <div className="ride-meta-grid">
            <p><strong>Booking ID:</strong> <span className="mono">{booking._id}</span></p>
            {booking.driverId ? (
              <p><strong>Driver:</strong> {booking.driverId.userId?.name} ({booking.driverId.vehicle?.make} - {booking.driverId.vehicle?.licensePlate})</p>
            ) : (
              <p><strong>Driver:</strong> Searching for nearby cabs...</p>
            )}
          </div>
        </div>

        {/* Live GPS Animation Mapping Visualizer */}
        <div className="gps-visualizer-card">
          <h3>📍 Live Route Map</h3>
          
          <div className="route-map-container" style={{ position: 'relative', height: '400px', backgroundColor: '#f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
            <div id="live-leaflet-map" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
          </div>

          <div className="route-addresses">
            <div className="address-box">
              <span className="marker green">●</span>
              <div>
                <strong>Pickup Point:</strong>
                <p>{booking.pickupLocation?.address || 'Calculating...'}</p>
              </div>
            </div>
            <div className="address-box">
              <span className="marker red">▲</span>
              <div>
                <strong>Dropoff Point:</strong>
                <p>{booking.dropoffLocation?.address || 'Calculating...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Actions Box (Shows Payment request if completed) */}
        <div className="actions-card">
          {booking.status === 'requested' && (
            <div className="status-banner info">
              <div className="loader-dots"><span></span><span></span><span></span></div>
              <p>Your request has been broadcasted to nearby drivers. Please stay on this page.</p>
            </div>
          )}

          {booking.status === 'accepted' && (
            <div className="status-banner success">
              <p>Driver has accepted your request! They are setting up navigation tracks.</p>
            </div>
          )}

          {booking.status === 'on_the_way' && (
            <div className="status-banner primary">
              <p>Driver is approaching. Get ready at the pickup location!</p>
            </div>
          )}

          {booking.status === 'arrived' && (
            <div className="status-banner success-accent animate-pulse">
              <p>🚕 The cab has arrived! Board the vehicle and share your booking details.</p>
            </div>
          )}

          {booking.status === 'in_progress' && (
            <div className="status-banner purple-gradient">
              <p>⚡ Have a safe journey! Cruising towards dropoff destination.</p>
            </div>
          )}

          {booking.status === 'completed' && (
            <div className="payment-pending-card">
              <h2>🏁 Destination Reached!</h2>
              <p>Please complete your payment of <strong>₹{fareAmount}</strong> to finish the booking.</p>
              
              {booking.fare?.isPaid ? (
                <div className="paid-status-badge">
                  <span>✅ PAID ONLINE via UPI Wallet</span>
                  <button className="btn btn-secondary" onClick={() => setShowRating(true)}>
                    Write Driver Review
                  </button>
                </div>
              ) : (
                <div className="payment-options">
                  <button className="btn phonepe-btn" onClick={() => setShowPhonePe(true)}>
                    🍇 Pay using PhonePe UPI
                  </button>
                  <p className="payment-footer-text">Secure transaction powered by PhonePe gateways.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* PHONEPE SIMULATED GATEWAY DIALOG MODAL                  */}
      {/* ======================================================== */}
      {showPhonePe && (
        <div className="phonepe-modal-overlay">
          <div className="phonepe-container">
            {/* Header section */}
            <div className="phonepe-header">
              <div className="phonepe-logo-block">
                <span className="phonepe-logo-icon">🍇</span>
                <span className="phonepe-logo-text">PhonePe</span>
              </div>
              <button className="close-btn" onClick={() => setShowPhonePe(false)}>✕</button>
            </div>

            {/* Main content viewport */}
            {!paymentSuccess ? (
              <div className="phonepe-payment-screen">
                {/* Merchant detail card */}
                <div className="merchant-details">
                  <div className="avatar-initials">CU</div>
                  <div className="merchant-info">
                    <h4>Paying to</h4>
                    <h3>Cab-U Rides Service</h3>
                    <p className="merchant-upi">caburides@ybl</p>
                  </div>
                  <div className="fare-badge">
                    <span className="currency">₹</span>
                    <span className="amount">{fareAmount}</span>
                  </div>
                </div>

                {/* Secure info tag */}
                <div className="secure-badge-tag">
                  🛡️ 256-Bit SSL Secure Banking Channel
                </div>

                {/* UPI PIN entry panel */}
                <div className="upi-pin-section">
                  <p>ENTER 6-DIGIT UPI PIN</p>
                  <div className="pin-indicator-row">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <div 
                        key={idx} 
                        className={`pin-dot ${upiPin.length > idx ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Keypad entry grid layout */}
                {paymentLoading ? (
                  <div className="phonepe-processing-state">
                    <div className="banking-spinner"></div>
                    <p className="processing-main">Processing payment...</p>
                    <p className="processing-sub">Please do not press back or refresh</p>
                  </div>
                ) : (
                  <div className="phonepe-keypad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button key={num} onClick={() => handleKeypadPress(String(num))}>
                        {num}
                      </button>
                    ))}
                    <button className="keypad-util" onClick={() => handleKeypadPress('delete')}>⌫</button>
                    <button onClick={() => handleKeypadPress('0')}>0</button>
                    <button className="keypad-confirm" onClick={handlePaymentSubmit}>✓</button>
                  </div>
                )}
              </div>
            ) : (
              /* Success confirmation viewport */
              <div className="phonepe-success-screen">
                <div className="check-outer-circle">
                  <span className="success-checkmark">✓</span>
                </div>
                <h2>Transaction Successful</h2>
                <p className="success-amount">₹{fareAmount}</p>
                <div className="tx-details-list">
                  <p><span>Merchant:</span> <strong>Cab-U Rides</strong></p>
                  <p><span>Transaction ID:</span> <span className="mono">TXN784392942048</span></p>
                  <p><span>Debited From:</span> <strong>XXXXXX4029 (Bank UPI)</strong></p>
                </div>
                <p className="thank-you-tag">Redirecting back to booking dashboard...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RIDE COMPLETION AND RATING REVIEW DIALOG MODAL         */}
      {/* ======================================================== */}
      {showRating && (
        <div className="rating-modal-overlay">
          <div className="rating-card-box">
            <h2>⭐ Rate Your Driver</h2>
            <p>Tell us how your ride with {booking.driverId?.userId?.name || 'your driver'} was!</p>
            
            <form onSubmit={handleRatingSubmit}>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`star-icon ${rating >= star ? 'selected' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="form-group">
                <label>Review comments (Optional)</label>
                <textarea 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us about the vehicle condition, speed, behavior, etc."
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={ratingSubmitting}>
                {ratingSubmitting ? 'Submitting Review...' : 'Submit and Finish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackRide
