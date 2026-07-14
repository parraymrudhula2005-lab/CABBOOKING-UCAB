import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import { supportAPI } from '../services/api'
import '../styles/dashboard.css'

function Dashboard() {
  const { user, getProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  
  // Support states
  const [tickets, setTickets] = useState([])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [ticketLoading, setTicketLoading] = useState(false)

  const fetchTickets = async () => {
    try {
      const response = await supportAPI.getUserTickets()
      setTickets(response.data.tickets || [])
    } catch (err) {
      console.error('Failed to fetch support tickets:', err)
    }
  }

  useEffect(() => {
    setLoading(true)
    getProfile()
    fetchTickets()
    setLoading(false)
  }, [])

  const handleRaiseTicket = async (e) => {
    e.preventDefault()
    if (!subject || !description) return

    setTicketLoading(true)
    try {
      await supportAPI.createTicket({ subject, description })
      setSubject('')
      setDescription('')
      alert('⚙️ Support ticket raised successfully! Our support agents are checking.')
      fetchTickets()
    } catch (err) {
      alert('Failed to raise support ticket.')
    } finally {
      setTicketLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>

        <div className="dashboard-grid">
          
          {/* Profile Card */}
          <div className="profile-card">
            <h2>👤 Your Profile</h2>
            {user ? (
              <div className="profile-info">
                <div className="profile-item-row">
                  <span className="profile-item-label">Full Name</span>
                  <span className="profile-item-val">{user.name}</span>
                </div>
                <div className="profile-item-row">
                  <span className="profile-item-label">Email Address</span>
                  <span className="profile-item-val">{user.email}</span>
                </div>
                <div className="profile-item-row">
                  <span className="profile-item-label">Phone Number</span>
                  <span className="profile-item-val">{user.phone || 'Not provided'}</span>
                </div>
                <div className="profile-item-row">
                  <span className="profile-item-label">User Role</span>
                  <span className="profile-item-val" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </div>
              </div>
            ) : (
              <p>Loading profile details...</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>🚀 Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/book-ride" className="action-btn">
                📍 Book a Ride
              </Link>
              <Link to="/ride-history" className="action-btn">
                📋 Ride History
              </Link>
              {user?.role === 'driver' ? (
                <Link to="/driver-dashboard" className="action-btn" style={{ background: '#000000', color: '#ffffff' }}>
                  🚕 Driver Panel Control
                </Link>
              ) : (
                <Link to="/driver-register" className="action-btn">
                  🚕 Become a Driver Partner
                </Link>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="stats">
            <h2>📊 Your Stats</h2>
            
            <div className="stat-item">
              <div className="stat-row-top">
                <span className="stat-label">Total Rides Completed</span>
                <span className="stat-value">12</span>
              </div>
              <div className="stat-3d-bar-container">
                <div className="stat-3d-bar-fill" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-row-top">
                <span className="stat-label">Total Wallet Spent</span>
                <span className="stat-value">₹1,840</span>
              </div>
              <div className="stat-3d-bar-container">
                <div className="stat-3d-bar-fill" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-row-top">
                <span className="stat-label">Passenger Account Rating</span>
                <span className="stat-value">4.9 ★</span>
              </div>
              <div className="stat-3d-bar-container">
                <div className="stat-3d-bar-fill" style={{ width: '98%' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Support Panel */}
        <div className="support-section" style={{ marginTop: '30px' }}>
          <div className="card support-card" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.03)' }}>
            <h2 style={{ fontSize: '20px', color: '#000000', marginTop: '0', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px', fontWeight: '800' }}>
              🛠️ Help & Support Center
            </h2>
            <div className="support-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              
              {/* Form card */}
              <div>
                <h3 style={{ fontSize: '15px', color: '#000000', margin: '0 0 16px', fontWeight: '750' }}>Raise a Support Ticket</h3>
                <form onSubmit={handleRaiseTicket}>
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>Subject Topic</label>
                    <input 
                      type="text" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                      placeholder="e.g. Lost wallet, payment issue"
                      required
                      style={{ width: '100%', padding: '12px', border: '1.5px solid rgba(0,0,0,0.05)', borderRadius: '10px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8fafc' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>Description of Concern</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Explain your problem in detail here..."
                      required
                      rows="3"
                      style={{ width: '100%', padding: '12px', border: '1.5px solid rgba(0,0,0,0.05)', borderRadius: '10px', boxSizing: 'border-box', resize: 'none', outline: 'none', backgroundColor: '#f8fafc' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '14px', fontWeight: '700', borderRadius: '10px', backgroundColor: '#000000', color: '#ffffff', border: 'none', cursor: 'pointer' }} disabled={ticketLoading}>
                    {ticketLoading ? 'Submitting...' : 'Submit Support Request'}
                  </button>
                </form>
              </div>

              {/* Tickets List */}
              <div>
                <h3 style={{ fontSize: '15px', color: '#000000', margin: '0 0 16px', fontWeight: '750' }}>Active Support Tickets ({tickets.length})</h3>
                <div className="support-tickets-container" style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '16px', padding: '16px', background: '#f8fafc' }}>
                  {tickets.length === 0 ? (
                    <p style={{ color: '#718096', textAlign: 'center', margin: '40px 0', fontSize: '13px', fontWeight: '500' }}>No active support requests raised.</p>
                  ) : (
                    tickets.map(ticket => (
                      <div key={ticket._id} style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <strong style={{ fontSize: '13px', color: '#000000' }}>{ticket.subject}</strong>
                          <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: ticket.status === 'open' ? '#d97706' : '#059669', background: ticket.status === 'open' ? '#fef3c7' : '#d1fae5', padding: '3px 8px', borderRadius: '20px' }}>
                            {ticket.status}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4a5568', lineHeight: '1.4' }}>{ticket.description}</p>
                        <div style={{ fontSize: '10px', color: '#a0aec0', fontWeight: '500' }}>Filed on: {new Date(ticket.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
