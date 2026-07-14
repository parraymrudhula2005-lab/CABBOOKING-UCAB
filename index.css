import axios from 'axios';

const API_BASE_URL = window.location.origin.includes('localhost') ? 'http://localhost:5001/api' : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API calls
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Driver API calls
export const driverAPI = {
  register: (driverData) => api.post('/drivers/register', driverData),
  getProfile: () => api.get('/drivers/profile'),
  updateLocation: (location) => api.put('/drivers/location', location),
  toggleOnlineStatus: () => api.put('/drivers/toggle-online'), // Mapped to driverDashboard toggleOnlineStatus
  getNearby: (location) => api.post('/drivers/nearby', location),
  getEarnings: () => api.get('/drivers/earnings'),
};

// Booking API calls
export const bookingAPI = {
  requestRide: (bookingData) => api.post('/bookings/request', bookingData),
  acceptRide: (bookingId) => api.post('/bookings/accept', { bookingId }),
  getBooking: (bookingId) => api.get(`/bookings/${bookingId}`),
  updateStatus: (bookingId, status) =>
    api.put(`/bookings/${bookingId}/status`, { status }),
  getUserBookings: () => api.get('/bookings/user/all'),
  getDriverBookings: () => api.get('/bookings/driver/all'), // Fetch bookings assigned to this driver
  getAvailableBookings: () => api.get('/bookings/available'), // Fetch available requested bookings
  completeRide: (bookingId, rating, review) =>
    api.put(`/bookings/${bookingId}/complete`, {
      driverRating: rating,
      driverReview: review,
    }),
  payRide: (bookingId, paymentMethod) =>
    api.put(`/bookings/${bookingId}/pay`, { paymentMethod }),
};

// Support API calls
export const supportAPI = {
  createTicket: (ticketData) => api.post('/support/create', ticketData),
  getUserTickets: () => api.get('/support/user/all'),
};

// Health check
export const checkHealth = () => api.get('/health');

export default api;
