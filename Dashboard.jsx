import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import '../styles/navbar.css'

function Navbar() {
  const { token, logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            Cab-U
          </Link>
          <ul className="navbar-menu">
            <li>
              <Link to="/book-ride">Ride</Link>
            </li>
            <li>
              <Link to="/driver-register">Drive</Link>
            </li>
            {token && (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/ride-history">History</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-right">
          <div className="navbar-meta">
            <span className="meta-item">🌐 EN</span>
            <span className="meta-item">Help</span>
          </div>

          <div className="navbar-auth">
            {token ? (
              <>
                <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login-link">
                  Log in
                </Link>
                <Link to="/register" className="btn-signup">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
