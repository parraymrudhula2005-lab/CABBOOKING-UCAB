# 🧪 API Testing Guide

## Quick Start Testing

### 1. Start the Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   🚕 CAB-U Backend Server Started     ║
║   Port: 5000                          ║
║   Environment: development            ║
╚════════════════════════════════════════╝

✅ MongoDB Connected: localhost
```

### 2. Test Using cURL

Replace `YOUR_TOKEN` with the actual token received from login.

---

## API Tests

### A. USER REGISTRATION & LOGIN

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj@test.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "user"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Raj Kumar",
    "email": "raj@test.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

#### 2. Login User
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj@test.com",
    "password": "password123"
  }'
```

**Save the token from response!**

#### 3. Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Update User Profile
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Raj Kumar Updated",
    "address": {
      "street": "123 Main Street",
      "city": "Delhi",
      "state": "Delhi",
      "zipCode": "110001"
    }
  }'
```

---

### B. DRIVER REGISTRATION

#### 1. Register as Driver
First, login as a user, then use that token:

```bash
curl -X POST http://localhost:5000/api/drivers/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "licenseNumber": "DL-0120240012345",
    "licenseExpiry": "2026-12-31",
    "vehicle": {
      "type": "sedan",
      "make": "Toyota",
      "model": "Fortuner",
      "year": 2022,
      "licensePlate": "DL-01-AB-1234",
      "color": "Silver"
    },
    "bankDetails": {
      "accountHolder": "Raj Kumar",
      "accountNumber": "1234567890",
      "bankName": "ICICI Bank",
      "ifscCode": "ICIC0000001"
    }
  }'
```

#### 2. Get Driver Profile
```bash
curl -X GET http://localhost:5000/api/drivers/profile \
  -H "Authorization: Bearer YOUR_DRIVER_TOKEN"
```

#### 3. Toggle Online Status
```bash
curl -X PUT http://localhost:5000/api/drivers/toggle-online \
  -H "Authorization: Bearer YOUR_DRIVER_TOKEN"
```

#### 4. Update Driver Location
```bash
curl -X PUT http://localhost:5000/api/drivers/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DRIVER_TOKEN" \
  -d '{
    "latitude": 28.7041,
    "longitude": 77.1025
  }'
```

#### 5. Get Nearby Drivers
```bash
curl -X POST http://localhost:5000/api/drivers/nearby \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": 28.7041,
    "longitude": 77.1025,
    "maxDistance": 5000
  }'
```

#### 6. Get Driver Earnings
```bash
curl -X GET http://localhost:5000/api/drivers/earnings \
  -H "Authorization: Bearer YOUR_DRIVER_TOKEN"
```

---

### C. RIDE BOOKING

#### 1. Request a Ride (User)
```bash
curl -X POST http://localhost:5000/api/bookings/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "pickupLocation": {
      "address": "Gate 1, IIT Delhi, New Delhi",
      "coordinates": {
        "type": "Point",
        "coordinates": [77.1923, 28.5921]
      }
    },
    "dropoffLocation": {
      "address": "Rajpath, New Delhi",
      "coordinates": {
        "type": "Point",
        "coordinates": [77.1732, 28.6139]
      }
    },
    "rideType": "economy"
  }'
```

**Copy the bookingId from response!**

#### 2. Accept Ride (Driver)
```bash
curl -X POST http://localhost:5000/api/bookings/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DRIVER_TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID_FROM_PREVIOUS"
  }'
```

#### 3. Get Booking Details
```bash
curl -X GET http://localhost:5000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Update Ride Status
```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DRIVER_TOKEN" \
  -d '{
    "status": "on_the_way"
  }'
```

Status values: `on_the_way`, `arrived`, `in_progress`, `completed`, `cancelled`

#### 5. Get All User Bookings
```bash
curl -X GET http://localhost:5000/api/bookings/user/all \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

#### 6. Complete Ride with Rating
```bash
curl -X PUT http://localhost:5000/api/bookings/BOOKING_ID/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "driverRating": 5,
    "driverReview": "Great driver! Very professional."
  }'
```

---

### D. HEALTH CHECK

```bash
curl http://localhost:5000/api/health
```

---

## Using Postman

### 1. Import Requests

Instead of cURL, you can use [Postman](https://www.postman.com/downloads/):

1. Create a new Collection
2. Add new requests for each endpoint
3. Add `Authorization: Bearer YOUR_TOKEN` in Headers
4. Set body as JSON for POST/PUT requests

### 2. Set Environment Variable for Token

1. Create an environment variable: `token`
2. After login, copy token value
3. Set: `Authorization: Bearer {{token}}`
4. Postman will auto-replace {{token}} with your value

---

## Testing Workflow

### Complete Flow:

```bash
# 1. Create User Account (User 1)
POST /api/users/register (name: "Alice", email: "alice@test.com")
→ Save token as USER1_TOKEN

# 2. Create Driver Account (User 2)
POST /api/users/register (name: "Bob", email: "bob@test.com")
→ Save token as USER2_TOKEN

# 3. Make Bob a Driver
POST /api/drivers/register (with USER2_TOKEN)
→ Save driver info

# 4. Bob goes online
PUT /api/drivers/toggle-online (with USER2_TOKEN)

# 5. Update Bob's location
PUT /api/drivers/location (with USER2_TOKEN)

# 6. Alice requests a ride
POST /api/bookings/request (with USER1_TOKEN)
→ Save bookingId

# 7. Bob accepts the ride
POST /api/bookings/accept (with USER2_TOKEN, bookingId)

# 8. Bob updates status to on_the_way
PUT /api/bookings/{bookingId}/status (status: "on_the_way")

# 9. Bob updates status to arrived
PUT /api/bookings/{bookingId}/status (status: "arrived")

# 10. Bob updates status to in_progress
PUT /api/bookings/{bookingId}/status (status: "in_progress")

# 11. Alice completes ride with rating
PUT /api/bookings/{bookingId}/complete (driverRating: 5)
```

---

## Monitor Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. View these collections:
   - **users** - All registered users
   - **drivers** - Driver profiles
   - **bookings** - All ride bookings

Watch data appear in real-time as you make API calls!

---

## Troubleshooting

### Issue: Authorization token not working
- Make sure token is from login endpoint
- Include `Bearer` prefix in Authorization header
- Check if token is not expired

### Issue: MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check `.env` MONGODB_URI is correct
- Open MongoDB Compass to verify connection

### Issue: Port 5000 already in use
- Change PORT in `.env` to 5001
- Or kill process using port: `netstat -ano | findstr :5000`

---

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Environment for Testing

```env
MONGODB_URI=mongodb://localhost:27017/cab-u
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

---

Happy Testing! 🎉
