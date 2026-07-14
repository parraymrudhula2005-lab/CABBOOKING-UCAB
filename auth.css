import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import '../styles/home.css'

function Home() {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [timeOption, setTimeOption] = useState('now') // 'now' or 'later'

  const handleSeePrices = (e) => {
    e.preventDefault()
    // Redirect to the booking page pre-populated with these values
    navigate('/book-ride', { state: { pickup, dropoff } })
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          
          {/* Left Column: Form */}
          <div className="hero-form-panel">
            <div className="city-selector">
              <span className="pin-icon">📍</span>
              <span className="city-name">Bangalore, IN</span>
              <span className="change-city-btn">Change city</span>
            </div>

            <h1 className="hero-title">Request a ride for now or later</h1>

            <div className="promo-banner">
              <span className="promo-icon">🏷️</span>
              <div className="promo-text">
                <p className="promo-title">Up to 50% off your first 5 Cab-U rides. <span className="promo-tc">T&Cs apply.*</span></p>
                <p className="promo-sub">*Valid within 15 days of signup.</p>
              </div>
            </div>

            <form onSubmit={handleSeePrices} className="ride-request-form">
              <div className="time-select-dropdown">
                <span className="clock-icon">🕒</span>
                <select 
                  value={timeOption} 
                  onChange={(e) => setTimeOption(e.target.value)}
                  className="time-select"
                >
                  <option value="now">Pickup now</option>
                  <option value="later">Schedule for later</option>
                </select>
              </div>

              <div className="location-inputs-container">
                <div className="connector-line-wrapper">
                  <div className="dot-circle"></div>
                  <div className="line-bar"></div>
                  <div className="dot-square"></div>
                </div>

                <div className="inputs-wrapper">
                  <div className="input-with-arrow">
                    <input
                      type="text"
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      required
                      className="location-input"
                    />
                    <span className="location-arrow-icon">➔</span>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    required
                    className="location-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn-see-prices">
                See prices
              </button>
            </form>
          </div>

          {/* Right Column: Illustration */}
          <div className="hero-image-panel">
            <img 
              src="/uber_hero.jpg" 
              alt="Passenger walking to cab" 
              className="hero-illustration" 
            />
          </div>

        </div>
      </section>

      {/* Info Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safety first</h3>
            <p>From verified driver profiles to real-time tracking, your ride security is our core priority.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>No hidden fees</h3>
            <p>Know exactly what you pay before booking. No surprise surge charges or hidden pricing.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant dispatch</h3>
            <p>Our smart dispatch algorithm matches you to the closest online driver in under 15 seconds.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
