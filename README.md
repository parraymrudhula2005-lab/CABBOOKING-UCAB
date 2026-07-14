# 🚕 Cab-U: MERN Stack Cab Booking & Ride Management Platform

A modern, high-performance web application for cab booking, real-time route tracking, interactive driver dispatch, and secure digital checkouts.

---

## 1. Introduction

* **Project Title**: Cab-U (Cab Booking & Ride Management System)
* **Team Members**: Hemanth (Full Stack Engineer & Project Owner)
* **Email**: hemanthsivasai19@gmail.com

---

## 2. Project Overview

### Purpose
Cab-U is a comprehensive MERN stack platform designed to streamline passenger-driver matching. It resolves traditional ride-hailing complexities by providing instant driver broadcasts, real-time visual location mapping, dynamic pre-booking fare estimates, and a simulation of the PhonePe UPI payment checkout flow.

### Key Features
* **Authentication**: Dedicated secure registration and login portals for passengers and drivers with JWT.
* **Fare & Distance Estimator**: Pre-calculates distance and fare dynamically depending on ride type (Economy, Premium, Shared) and address length.
* **Driver Panel Loop**: Driver status toggling (Online/Offline), incoming ride broadcasts list, and step-by-step trip progression controls.
* **Live GPS Simulator**: Simulates real-time coordinate changes moving the cab towards the passenger on an interactive route map.
* **PhonePe Checkout Gateway**: A fully styled checkout modal mimicking a secure UPI transactions screen with keypad input and progress loaders.
* **Support Ticket Desk**: Passenger ticket registration panel with real-time status tracking logs.

---

## 3. Architecture

The application is structured as a decoupled monorepo:

```
               ┌────────────────────────┐
               │    React Web Client    │
               │   (Vite + Zustand)     │
               └───────────┬────────────┘
                           │ (JSON/HTTPS)
                           ▼
               ┌────────────────────────┐
               │  Node / Express Server │
               └───────────┬────────────┘
                           │ (Mongoose ODM)
                           ▼
               ┌────────────────────────┐
               │    MongoDB Database    │
               └────────────────────────┘
```

* **Frontend (React)**: Implemented as a Single Page Application (SPA). State management is managed with **Zustand** (specifically for seamless, synchronous token handling to prevent reload page redirects).
* **Backend (Node.js & Express)**: RESTful architecture with modular routers, controllers, schema models, and security middleware.
* **Database (MongoDB)**: Structured collections utilizing GeoJSON schemas to hold location markers, payments, and tickets.

---

## 4. Setup Instructions

### Prerequisites
* **Node.js** (v16.0.0 or higher)
* **npm** (v8.0.0 or higher)
* **MongoDB Server** (running locally on `mongodb://localhost:27017`)

### Installation & Configuration

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hemanth-1912/CAB-BOOKING.git
   cd CAB-BOOKING
   ```

2. **Configure Environment Variables**:
   * Create a `.env` file in the `server/` directory:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/cab-u
     JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
     NODE_ENV=development
     ```
   * Create a `.env` file in the `client/` directory:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

3. **Install Dependencies**:
   * Inside the `server/` directory:
     ```bash
     cd server
     npm install
     ```
   * Inside the `client/` directory:
     ```bash
     cd ../client
     npm install
     ```

---

## 5. Folder Structure

```
CAB-BOOKING/
├── client/                 # React Frontend
│   ├── public/             # Static Assets
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, etc.)
│   │   ├── context/        # Zustand state store
│   │   ├── pages/          # Pages (Login, BookRide, Dashboard, TrackRide)
│   │   ├── services/       # Axios API wrapper functions
│   │   └── styles/         # Custom Vanilla CSS stylesheets
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── config/             # DB Connection helpers
│   ├── controllers/        # Route logic handlers
│   ├── middleware/         # JWT Authentication checker
│   ├── models/             # Mongoose Schemas (User, Driver, Booking, Payment, Support)
│   ├── routes/             # Router endpoints mappings
│   ├── package.json
│   └── server.js
│
└── .gitignore              # Project-level git ignore rules
```

---

## 6. Running the Application

Ensure MongoDB is active on your machine.

1. **Start the Backend server**:
   ```bash
   cd server
   npm run dev
   ```
   The backend will start on **`http://localhost:5000`**.

2. **Start the Frontend development server**:
   ```bash
   cd client
   npm run dev
   ```
   The client will start on **`http://localhost:3000`**.

---

## 7. API Documentation

### Authentication Endpoints
* `POST /api/users/register`: Registers a new account.
* `POST /api/users/login`: Authenticates user and returns JWT.
* `GET /api/users/profile`: Retrieves logged-in profile data (Requires Bearer token).

### Booking Endpoints
* `POST /api/bookings/request`: Requests a new ride.
* `POST /api/bookings/accept`: Drivers accept a requested ride.
* `GET /api/bookings/available`: Fetches all unassigned rides for online drivers.
* `GET /api/bookings/user/all`: Passenger ride history list.
* `GET /api/bookings/driver/all`: Driver completed/active jobs list.
* `PUT /api/bookings/:bookingId/status`: Updates ride progress (`approaching`, `arrived`, `started`, `completed`).
* `PUT /api/bookings/:bookingId/pay`: Settles fare payment.
* `PUT /api/bookings/:bookingId/complete`: Finalizes ride, saves passenger ratings and reviews.

### Customer Support Endpoints
* `POST /api/support/create`: Passenger submits a support ticket.
* `GET /api/support/user/all`: Fetches tickets submitted by the logged-in passenger.

---

## 8. Authentication

Authentication is handled securely via **JSON Web Tokens (JWT)**:
1. Upon successful registration or login, the server generates a token signed with the `JWT_SECRET`.
2. The React client stores the token in `localStorage` and loads it synchronously on launch to avoid race conditions.
3. Axios request interceptors automatically inject the token as a `Bearer <token>` string in the `Authorization` header for all protected API calls.
4. The server's `auth` middleware verifies the header token and attaches the validated `userId` and `role` to the request object.

---

## 9. User Interface

* **Passenger Dashboard**: Shows profile stats, quick links, and a scrollable support desk to log issues.
* **Driver Dashboard**: Allows drivers to toggle duty status, accept broadcasted bookings, and progress active rides.
* **Book Ride**: Form with pickup/dropoff inputs featuring a dynamic fare visualizer card.
* **Live GPS Route Tracker**: Animated progress visualizer showing the cab's path.
* **PhonePe Checkout Panel**: Implements a replica of the PhonePe keypad overlay for secure UPI PIN entries.

---

## 10. Testing

### Backend Testing
All REST endpoints have been tested utilizing **Postman**. Verification includes:
* Checking authentication blocks (verifying that calls without headers fail with `401 Unauthorized`).
* Mocking booking creations, driver status updates, and checking that database attributes update accordingly.

### Frontend Integration Verification
* UI tested on Edge, Chrome, and Firefox to verify responsive mobile viewport resizing.
* Routing validations confirmed that refreshing pages or navigating between history logs maintains tokens without showing login alerts.

---

## 11. Known Issues

* **Simulated GPS Coordinates**: The map visualizer utilizes simulated steps instead of actual Google Maps API routing to prevent cost overheads.
* **PhonePe Sandbox**: Uses a simulated local authorization module rather than contacting the PhonePe production gateway.

---

## 12. Future Enhancements

* **Real-time Map Integration**: Bind Leaflet.js or Google Maps SDK to show real street navigation.
* **SMS Gateway Integration**: Hook up Twilio API to broadcast SMS text notifications for OTP authentication and cab arrivals.
* **Admin Dashboard**: Create a central panel for managers to oversee support tickets, register vehicle inspections, and view earnings.

<!-- Project metadata verification by Hemanth -->
