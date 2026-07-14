# 📊 How to Create & View MongoDB Database

## ❌ Why You Don't See "cab-u" Database Yet

MongoDB **only creates databases when data is inserted**. Empty databases don't show in Compass!

---

## ✅ HOW TO CREATE DATABASE (4 STEPS)

### Step 1: Verify MongoDB is Running

**Windows:**
1. Press `Win + R`
2. Type: `services.msc`
3. Find "MongoDB"
4. Status should be: **Started** ✅
5. If not, right-click → "Start"

**Alternative - Command Line:**
```bash
mongod --version
```
If you see version info, it's installed. If not running as service:
```bash
mongod
```

---

### Step 2: Start Backend Server

**Open Command Prompt/PowerShell:**
```bash
cd C:\Users\HP 830 G6\OneDrive\Desktop\Cab-U
npm run dev
```

**You should see:**
```
✅ MongoDB Connected: localhost

╔════════════════════════════════════════╗
║   🚕 CAB-U Backend Server Started     ║
║   Port: 5000                          ║
║   Environment: development            ║
╚════════════════════════════════════════╝
```

✅ Backend is running and connected to MongoDB!

---

### Step 3: Create Data (This Creates Database!)

**Open NEW Command Prompt/PowerShell window:**

#### Option A: Using Batch File (Easiest)
```bash
cd C:\Users\HP 830 G6\OneDrive\Desktop\Cab-U
create_test_data.bat
```

#### Option B: Using cURL Command
```bash
curl -X POST http://localhost:5000/api/users/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"pass123\",\"phone\":\"9000000000\",\"role\":\"user\"}"
```

#### Option C: Using PowerShell
```powershell
$body = @{
    name = "Test User"
    email = "test@test.com"
    password = "pass123"
    phone = "9000000000"
    role = "user"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/users/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

### Step 4: View Database in MongoDB Compass

1. **Open MongoDB Compass**
2. **Click Refresh Icon** (or press F5)
3. **NOW you'll see:**
   - `cab-u` database ✅
   - `users` collection ✅
   - Your test user data ✅

---

## 🎯 WHAT HAPPENS AFTER DATA IS CREATED

When you insert the first user:

✅ **Database created:** `cab-u`
✅ **Collection created:** `users`
✅ **Document created:** User record with all fields
✅ **Appears in Compass:** Immediately after refresh

---

## 📋 COLLECTIONS THAT WILL BE CREATED

As you use the app:

1. **users** - Created when you register a user
2. **drivers** - Created when someone registers as driver
3. **bookings** - Created when someone books a ride

---

## 🧪 TEST DATA TO CREATE

### User Registration (Creates users collection)
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"pass123","phone":"9876543210","role":"user"}'
```

Response includes JWT token ✅

### Login (Get token)
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

Response includes JWT token ✅

### Register as Driver (Creates drivers collection)
```bash
curl -X POST http://localhost:5000/api/drivers/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"licenseNumber":"DL123456","licenseExpiry":"2026-12-31","vehicle":{"type":"sedan","make":"Toyota","model":"Fortuner","year":2022,"licensePlate":"DL01AB1234","color":"Black"},"bankDetails":{"accountHolder":"John Doe","accountNumber":"1234567890","bankName":"ICICI","ifscCode":"ICIC0001"}}'
```

### Request a Ride (Creates bookings collection)
```bash
curl -X POST http://localhost:5000/api/bookings/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"pickupLocation":{"address":"123 Main St","coordinates":{"type":"Point","coordinates":[77.2245,28.5355]}},"dropoffLocation":{"address":"456 Park Ave","coordinates":{"type":"Point","coordinates":[77.2345,28.5455]}},"rideType":"economy"}'
```

---

## 📊 MONGODB COMPASS NAVIGATION

Once database is created:

```
Local
├── cab-u (your database!)
│   ├── users
│   │   └── Documents (view your users)
│   ├── drivers
│   │   └── Documents (view drivers)
│   └── bookings
│       └── Documents (view bookings)
```

### Actions in Compass:
- **View data:** Click collection → see all documents
- **Filter:** Use query filters
- **Add data:** Manual insert
- **Delete:** Remove documents
- **Edit:** Update fields

---

## 🚨 TROUBLESHOOTING

### "Cannot reach server"
- [ ] MongoDB running? (Check services.msc)
- [ ] Backend running? (npm run dev)
- [ ] Port 5000 free? (Check with netstat)

### "Still no cab-u database"
- [ ] Created any data? (Run API call)
- [ ] Compass connected? (Check connection URI)
- [ ] Refresh Compass? (F5 or refresh button)

### "API call returns 401 Unauthorized"
- [ ] Forgot Bearer token? (Add -H "Authorization: Bearer TOKEN")
- [ ] Token expired? (Login again to get new token)

---

## ✅ VERIFICATION CHECKLIST

- [ ] MongoDB installed and running
- [ ] Backend started (npm run dev)
- [ ] API call successful (check response)
- [ ] MongoDB Compass refreshed
- [ ] "cab-u" database visible
- [ ] "users" collection visible
- [ ] Test user document visible

---

## 🎉 AFTER YOU SEE DATABASE

Now you can:

1. ✅ Use frontend to register
2. ✅ Frontend creates users in database
3. ✅ View real-time data in Compass
4. ✅ Book rides
5. ✅ See all data synchronized

---

## 📝 QUICK REFERENCE

| Task | Command |
|------|---------|
| Start MongoDB | `mongod` or check services.msc |
| Start Backend | `npm run dev` |
| Create User | `curl -X POST http://localhost:5000/api/users/register...` |
| Refresh Compass | F5 or click refresh icon |
| View Collections | Open Compass → cab-u → collections |

---

## 🎯 NEXT STEPS

1. ✅ Ensure MongoDB is running
2. ✅ Start backend with `npm run dev`
3. ✅ Run `create_test_data.bat` to create data
4. ✅ Refresh MongoDB Compass
5. ✅ See `cab-u` database with collections!

---

**Your database will appear immediately after the first API call! 🚀**
