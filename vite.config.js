.dashboard {
  background-color: #f8fafc;
  min-height: calc(100vh - 80px);
  padding: 60px 20px;
}

.dashboard h1 {
  font-size: 36px;
  font-weight: 800;
  color: #000000;
  letter-spacing: -0.04em;
  margin-bottom: 32px;
  text-align: left;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* 3D Glassmorphic Dashboard Cards */
.profile-card,
.quick-actions,
.stats {
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.02);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
  transform: translate3d(0, 0, 0); /* Force GPU compositing */
  backface-visibility: hidden;
}

.profile-card:hover,
.quick-actions:hover,
.stats:hover {
  transform: translate3d(0, -6px, 0);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.08);
}

.profile-card h2,
.quick-actions h2,
.stats h2 {
  font-size: 20px;
  font-weight: 850;
  color: #000000;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Profile Card Styling */
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-item-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  padding-bottom: 12px;
}

.profile-item-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.profile-item-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.profile-item-val {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

/* Quick Actions Button with 3D tactile press */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.action-btn {
  background-color: #000000;
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  transition: transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.1s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.1s ease;
  box-shadow: 0 4px 0 #333333, 0 8px 16px rgba(0, 0, 0, 0.06);
  text-align: center;
  transform: translate3d(0, 0, 0);
  will-change: transform, box-shadow;
  backface-visibility: hidden;
}

.action-btn:hover {
  background-color: #222222;
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 6px 0 #333333, 0 12px 20px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translate3d(0, 4px, 0);
  box-shadow: 0 0px 0 transparent, 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Stats Card with 3D Bar representation */
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-muted);
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  color: #10b981;
}

/* Simulated 3D progress bar */
.stat-3d-bar-container {
  background-color: #f1f5f9;
  height: 6px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.stat-3d-bar-fill {
  background: linear-gradient(90deg, #000000, #333333);
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-out;
}

/* Support section */
.support-card {
  border-radius: 24px !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
