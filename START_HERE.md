# 🚕 Cab-U Backend API

A complete backend for a cab booking application built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication (Register/Login)
- ✅ Driver registration and management
- ✅ Real-time ride booking
- ✅ Location-based driver search
- ✅ Ride tracking and status updates
- ✅ Rating and review system
- ✅ Earnings tracking for drivers
- ✅ JWT token-based authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- MongoDB Compass (for database visualization)

## Installation

### 1. Install Node Modules

```bash
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB (Recommended for Development)

```bash
# Make sure MongoDB is running on your system
# On Windows, MongoDB typically runs on mongodb://localhost:27017
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update the `MONGODB_URI` in `.env`

### 3. Environment Configuration

Create a `.env` file in the root directory (already provided, but update if needed):

```env
MONGODB_URI=mongodb://localhost:27017/cab-u
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 4. Connect MongoDB Compass

1. Open MongoDB Compass
2. Click "Create New"
3. Enter connection string: `mongodb://localhost:27017`
4. Click "Connect"
5. You'll see the `cab-u` database with collections:
   - `users`
   - `drivers`
   - `bookings`

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### User Endpoints

```
POST   /api/users/register        - Register new user
POST   /api/users/login           - Login user
GET    /api/users/profile         - Get user profile (Protected)
PUT    /api/users/profile         - Update user profile (Protected)
```

### Driver Endpoints

```
POST   /api/drivers/register      - Register as driver (Protected)
GET    /api/drivers/profile       - Get driver profile (Protected)
PUT    /api/drivers/location      - Update driver location (Protected)
PUT    /api/drivers/toggle-online - Toggle online status (Protected)
POST   /api/drivers/nearby        - Get nearby drivers (Protected)
GET    /api/drivers/earnings      - Get driver earnings (Protected)
```

### Booking Endpoints

```
POST   /api/bookings/request      - Request a ride (Protected)
POST   /api/bookings/accept       - Accept a ride (Protected)
GET    /api/bookings/:bookingId   - Get booking details (Protected)
PUT    /api/bookings/:bookingId/status - Update ride status (Protected)
GET    /api/bookings/user/all     - Get all user bookings (Protected)
PUT    /api/bookings/:bookingId/complete - Complete ride (Protected)
```

### Health Check

```
GET    /api/health                - Server health status
```

## Example API Usage

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "user"
  }'
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes JWT token - use this token for all protected endpoints.

### 3. Register as Driver

```bash
curl -X POST http://localhost:5000/api/drivers/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "licenseNumber": "DL123456",
    "licenseExpiry": "2025-12-31",
    "vehicle": {
      "type": "sedan",
      "make": "Toyota",
      "model": "Fortuner",
      "year": 2022,
      "licensePlate": "KA01AB1234",
      "color": "Black"
    },
    "bankDetails": {
      "accountHolder": "John Doe",
      "accountNumber": "1234567890",
      "bankName": "ICICI",
      "ifscCode": "ICIC0000001"
    }
  }'
```

### 4. Request a Ride

```bash
curl -X POST http://localhost:5000/api/bookings/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pickupLocation": {
      "address": "123 Main Street, City",
      "coordinates": {
        "type": "Point",
        "coordinates": [77.2245, 28.5355]
      }
    },
    "dropoffLocation": {
      "address": "456 Park Avenue, City",
      "coordinates": {
        "type": "Point",
        "coordinates": [77.2345, 28.5455]
      }
    },
    "rideType": "economy"
  }'
```

### 5. Accept a Ride (Driver)

```bash
curl -X POST http://localhost:5000/api/bookings/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DRIVER_TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID"
  }'
```

## Database Schema

### User Schema
- name (String)
- email (String, unique)
- password (String, hashed)
- phone (String, unique)
- role (String: user/driver/admin)
- address (Object)
- profilePicture (String)
- isActive (Boolean)
- timestamps

### Driver Schema
- userId (Reference to User)
- licenseNumber (String, unique)
- licenseExpiry (Date)
- vehicle (Object with type, make, model, year, licensePlate)
- documents (insurance, registration, etc.)
- bankDetails (account information)
- rating (Number: 1-5)
- totalRides (Number)
- totalEarnings (Number)
- currentLocation (GeoJSON Point)
- isVerified (Boolean)
- isOnline (Boolean)
- timestamps

### Booking Schema
- userId (Reference to User)
- driverId (Reference to Driver)
- status (String: requested/accepted/on_the_way/arrived/in_progress/completed/cancelled)
- pickupLocation (Address + Coordinates)
- dropoffLocation (Address + Coordinates)
- rideType (String: economy/premium/shared)
- distance (Number)
- duration (Number)
- fare (Object with baseFare, totalFare, discount, payment method)
- rating (Object with driverRating, userRating, reviews)
- timestamps for various ride stages

## Authentication

The API uses JWT (JSON Web Token) authentication. All protected routes require:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is obtained after login and should be included in the Authorization header of subsequent requests.

## MongoDB Connection Troubleshooting

### Issue: Cannot connect to MongoDB

**Solution 1**: Check if MongoDB is running
- Windows: Open Services and look for "MongoDB"
- Or run: `mongod` in command prompt

**Solution 2**: Change connection string in `.env`
- If using MongoDB Atlas, replace the URI with your connection string
- Format: `mongodb+srv://username:password@cluster0.mongodb.net/cab-u`

**Solution 3**: Create `.env` file
- Ensure `.env` file exists in root directory
- Add: `MONGODB_URI=mongodb://localhost:27017/cab-u`

## Development Tips

1. **Use MongoDB Compass** to:
   - View all database collections
   - Insert test data
   - Run database queries
   - Monitor data changes in real-time

2. **Test API endpoints** using:
   - Postman (GUI)
   - cURL (command line)
   - Insomnia (API client)

3. **Enable auto-reload** during development:
   - Use `npm run dev` (requires nodemon)

## Project Structure

```
cab-u-backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   ├── Driver.js          # Driver schema
│   └── Booking.js         # Booking schema
├── controllers/
│   ├── userController.js      # User logic
│   ├── driverController.js    # Driver logic
│   └── bookingController.js   # Booking logic
├── routes/
│   ├── userRoutes.js      # User endpoints
│   ├── driverRoutes.js    # Driver endpoints
│   └── bookingRoutes.js   # Booking endpoints
├── middleware/
│   └── auth.js            # JWT authentication
├── server.js              # Main server file
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
└── package.json           # Dependencies
```

## Next Steps

1. ✅ Run `npm install` to install dependencies
2. ✅ Ensure MongoDB is running
3. ✅ Start server with `npm run dev`
4. ✅ Test API endpoints
5. ✅ Build frontend to consume these APIs
6. ✅ Deploy to production

## Deployment

For production deployment:

1. Deploy to platforms like:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway
   - Render

2. Use MongoDB Atlas for cloud database

3. Update `.env` with production values

4. Use environment variables for secrets

## Support

For issues or questions, refer to:
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## License

MIT License - Feel free to use this project

---

Happy Coding! 🚀
