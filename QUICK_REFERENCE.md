# 🗄️ MongoDB Setup Guide for Cab-U

## Option 1: Local MongoDB (Recommended)

### Windows Installation

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Run the installer

2. **MongoDB should be running automatically** (check Services)

3. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/products/compass
   - Download for Windows
   - Install it

4. **Connect Compass to Local MongoDB**
   - Open MongoDB Compass
   - Click "Create New Connection"
   - URI: `mongodb://localhost:27017`
   - Click "Connect"

5. **Connection string for code**
   ```
   MONGODB_URI=mongodb://localhost:27017/cab-u
   ```

### Verify MongoDB is Running

```bash
# Open Command Prompt and run:
mongod --version
```

If you see version info, MongoDB is installed. If it's not running as a service, start it:

```bash
mongod
```

---

## Option 2: MongoDB Atlas (Cloud)

### Setup Steps

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Sign Up" or "Log In"

2. **Create Free Cluster**
   - Click "Build a Deployment"
   - Select "Free" tier
   - Choose your region
   - Click "Create"

3. **Add Network Access**
   - Go to "Security" → "Network Access"
   - Click "Add IP Address"
   - Add current IP or "Allow Access from Anywhere" (0.0.0.0)
   - Click "Confirm"

4. **Create Database User**
   - Go to "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `cab-u-user`
   - Password: Create strong password
   - Click "Add User"

5. **Get Connection String**
   - Click "Drivers" button
   - Select "Node.js"
   - Copy the connection string
   - Replace `<password>` with your password

6. **Connection string format**
   ```
   MONGODB_URI=mongodb+srv://cab-u-user:PASSWORD@cluster0.mongodb.net/cab-u?retryWrites=true&w=majority
   ```

---

## Connect with MongoDB Compass

### Local Connection
```
Connection String: mongodb://localhost:27017
```

### Atlas Connection
```
Connection String: mongodb+srv://cab-u-user:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
```

---

## Using MongoDB Compass

Once connected, you'll see:

### Create Collections (Tables)

Collections are automatically created, but you can create them manually:

1. Right-click on `cab-u` database
2. Click "Create Collection"
3. Name: `users` (or drivers, bookings)
4. Click "Create"

### View Data

- Click on any collection to see documents
- View, add, edit, delete records
- Run queries and aggregations

### Sample Data to Test

#### Add Test User
```json
{
  "_id": {"$oid": "507f1f77bcf86cd799439011"},
  "name": "John Doe",
  "email": "john@test.com",
  "password": "hashed_password",
  "phone": "9876543210",
  "role": "user",
  "isActive": true,
  "createdAt": {"$date": "2024-01-01T00:00:00Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00Z"}
}
```

#### Add Test Driver
```json
{
  "_id": {"$oid": "507f1f77bcf86cd799439012"},
  "userId": {"$oid": "507f1f77bcf86cd799439011"},
  "licenseNumber": "DL123456",
  "licenseExpiry": {"$date": "2025-12-31T00:00:00Z"},
  "vehicle": {
    "type": "sedan",
    "make": "Toyota",
    "model": "Fortuner",
    "year": 2022,
    "licensePlate": "KA01AB1234",
    "color": "Black"
  },
  "rating": 4.8,
  "totalRides": 150,
  "totalEarnings": 45000,
  "isVerified": true,
  "isOnline": true,
  "createdAt": {"$date": "2024-01-01T00:00:00Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00Z"}
}
```

---

## Troubleshooting

### MongoDB Not Running

**Windows:**
1. Open Services (Press Win+R, type `services.msc`)
2. Look for "MongoDB"
3. If stopped, right-click and select "Start"
4. If not there, reinstall MongoDB

**Alternative (Manual Start):**
```bash
# Find MongoDB installation
mongod --dbpath "C:\data\db"
```

### Compass Cannot Connect

1. Check if MongoDB is running
2. Verify firewall isn't blocking MongoDB (port 27017)
3. Try different connection string:
   - `mongodb://127.0.0.1:27017`
   - `mongodb://localhost:27017`

### Atlas Connection Issues

1. Check IP Whitelist
   - Visit: https://cloud.mongodb.com
   - Go to Security → Network Access
   - Ensure your IP is added

2. Verify credentials
   - Username and password correct?
   - Special characters URL-encoded?

3. Check internet connection

---

## Important Port Numbers

- MongoDB Server: **27017**
- Node.js API: **5000** (default)
- MongoDB Compass: Connects to port 27017

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start server (requires MongoDB running)
npm run dev

# Or in production
npm start

# Check if MongoDB is running
mongod --version

# Connect to MongoDB CLI (if installed)
mongo mongodb://localhost:27017/cab-u
```

---

## Environment Variables (.env)

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/cab-u

# OR Atlas MongoDB
MONGODB_URI=mongodb+srv://cab-u-user:PASSWORD@cluster0.mongodb.net/cab-u?retryWrites=true&w=majority

# Other settings
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## Testing Connection

After setup, run:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
```

If you see this, you're ready to go! 🎉
