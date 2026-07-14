import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingAPI } from '../services/api'
import '../styles/ride-history.css'

function RideHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings()
      setBookings(response.data.bookings || [])
    } catch (err) {
      setError('Failed to fetch ride history')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ride-history">
      <div className="container">
        <h1>📋 Your Ride History</h1>

        {loading && <p className="loading">Loading rides...</p>}
        {error && <div className="error-message">{error}</div>}

        {bookings.length === 0 ? (
          <div className="no-rides">
            <p>No rides yet. <a href="/book-ride">Book your first ride!</a></p>
          </div>
        ) : (
          <div className="rides-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="ride-card">
                <div className="ride-header">
                  <div className="ride-date">
                    📅 {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  <div className={`status ${booking.status}`}>
                    {booking.status}
                  </div>
                </div>

                <div className="ride-details">
                  <p>
                    <strong>From:</strong> {booking.pickupLocation?.address}
                  </p>
                  <p>
                    <strong>To:</strong> {booking.dropoffLocation?.address}
                  </p>
                  <p>
                    <strong>Type:</strong> {booking.rideType}
                  </p>
                  <p>
                    <strong>Distance:</strong> {booking.distance || 'N/A'} km
                  </p>
                  {booking.fare && (
                    <p>
                      <strong>Fare:</strong> ₹{booking.fare.finalFare || 'N/A'}
                    </p>
                  )}
                </div>

                <div className="ride-actions" style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                  {booking.status !== 'completed' && booking.status !== 'cancelled' ? (
                    <Link to={`/track-ride/${booking._id}`} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px', textDecoration: 'none' }}>
                      📍 Track Live Location
                    </Link>
                  ) : booking.status === 'completed' && (!booking.fare?.isPaid || !booking.rating?.driverRating) ? (
                    <Link to={`/track-ride/${booking._id}`} className="btn btn-warning" style={{ fontSize: '13px', padding: '8px 16px', textDecoration: 'none', color: '#2d3748', fontWeight: 'bold' }}>
                      🍇 Pay or Review Driver
                    </Link>
                  ) : null}
                </div>

                {booking.status === 'completed' && booking.rating && (
                  <div className="ride-rating">
                    <p>
                      <strong>Your Rating:</strong>{' '}
                      {'⭐'.repeat(booking.rating.userRating || 0)}
                    </p>
                    <p>
                      <strong>Review:</strong> {booking.rating.userReview}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RideHistory
