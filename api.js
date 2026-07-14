import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { driverAPI } from '../services/api'
import '../styles/driver-register.css'

function DriverRegister() {
  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseExpiry: '',
    vehicleType: 'sedan',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    licensePlate: '',
    vehicleColor: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const driverData = {
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        vehicle: {
          type: formData.vehicleType,
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          year: parseInt(formData.vehicleYear),
          licensePlate: formData.licensePlate,
          color: formData.vehicleColor,
        },
        bankDetails: {
          accountHolder: formData.bankAccountHolder,
          accountNumber: formData.bankAccountNumber,
          bankName: formData.bankName,
          ifscCode: formData.ifscCode,
        },
      }

      await driverAPI.register(driverData)
      alert('Driver registration submitted! Awaiting admin verification.')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register as driver')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="driver-register">
      <div className="container">
        <h1>🚕 Become a Driver</h1>

        <div className="registration-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <h3>📋 License Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>License Expiry Date</label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h3>🚗 Vehicle Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="economy">Economy</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="form-group">
                <label>Make</label>
                <input
                  type="text"
                  name="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="e.g., KA01AB1234"
                  required
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h3>🏦 Bank Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="bankAccountHolder"
                  value={formData.bankAccountHolder}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DriverRegister
