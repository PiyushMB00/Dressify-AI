# 🎨 Dressify AI - Authentication & Database Setup Guide

## Overview
This guide explains the complete login/signup authentication system with MongoDB integration.

## System Architecture

### Frontend Flow
1. **First Visit**: User lands on website → redirected to `login.html`
2. **Login/Signup**: User credentials stored in browser localStorage with JWT token
3. **Authenticated Access**: Token verified on each page load
4. **Logout**: Token cleared and user redirected to login

### Backend Flow
1. **Auth Routes**: `/api/auth/signup` and `/api/auth/login`
2. **MongoDB Storage**: User data persisted in MongoDB database
3. **JWT Token**: Generated on successful login/signup (24h expiry)
4. **Token Verification**: `/api/auth/verify` endpoint validates tokens

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local or Atlas cloud)
3. **npm** packages installed

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use existing installation
# MongoDB should run on mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dressify
```

### 3. Start the Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Dressify Backend Server is running on http://127.0.0.1:8000
```

### 4. Create Admin User

Run the seeder script to create the admin account:

```bash
cd backend
node seed-admin.js
```

Output:
```
✅ Connected to MongoDB
✅ Admin user created successfully!
Email: shrvankad@gmail.com
Password: Shrvan@45
```

## Usage Flow

### First-Time User (Signup)
1. Open website → redirected to login page
2. Click "Sign Up"
3. Enter: Full Name, Email, Password, Confirm Password
4. Accept Terms & Conditions
5. Click "Sign Up"
6. Account created → Stored in MongoDB
7. Token generated → Stored in localStorage
8. Redirected to home page

### Returning User (Login)
1. Open website → redirected to login page
2. Enter email and password
3. Click "Login"
4. Password verified against MongoDB hash
5. Token generated → Stored in localStorage
6. Redirected to home page

### Admin Login
- **Email**: `shrvankad@gmail.com`
- **Password**: `Shrvan@45`
- Has `isAdmin: true` flag in database

### Logout
- Click "Logout" button in navigation
- Clears localStorage token
- Redirects to login page

## File Structure

### Backend
```
backend/
├── models/
│   └── User.js              # MongoDB User schema
├── routes/
│   └── auth.js              # Auth endpoints
├── seed-admin.js            # Admin user seeder
├── server.js                # Express server
└── .env                      # Environment variables
```

### Frontend
```
root/
├── login.html               # Login page
├── signup.html              # Signup page
├── index.html               # Home page (protected)
├── login.js                 # Login logic
├── signup.js                # Signup logic
└── auth-utils.js            # Auth utility functions
```

## API Endpoints

### POST /api/auth/signup
Create a new user account

**Request:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "...",
    "fullname": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/login
Login with email and password

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "fullname": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/verify
Verify JWT token validity

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Token is valid",
  "user": {
    "id": "...",
    "fullname": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### POST /api/auth/logout
Logout endpoint (client-side token deletion recommended)

**Response:**
```json
{
  "message": "Logout successful"
}
```

### GET /api/auth/users
Get all users (for testing/admin only)

**Response:**
```json
{
  "totalUsers": 5,
  "users": [
    {
      "_id": "...",
      "fullname": "Admin Shrvan",
      "email": "shrvankad@gmail.com",
      "isAdmin": true,
      "createdAt": "2024-01-19T..."
    }
  ]
}
```

## Frontend Auth Utilities

### `auth-utils.js` Functions

```javascript
// Check if user is authenticated
isAuthenticated()  // returns: boolean

// Get current logged-in user
getCurrentUser()   // returns: { id, fullname, email, isAdmin }

// Get JWT token
getAuthToken()     // returns: string

// Verify token with backend
await verifyAuthToken()  // returns: boolean

// Logout user
logout()           // clears storage and redirects to login

// Check auth and redirect to login if needed
await checkAuthAndRedirect()  // returns: boolean

// Redirect to login on first visit
checkFirstVisit()  // redirects if not authenticated

// Get authorization header for API calls
getAuthHeader()    // returns: { Authorization, Content-Type }
```

## Security Features

✅ **Password Hashing**: bcryptjs (10 salt rounds)
✅ **JWT Tokens**: 24-hour expiration
✅ **Token Verification**: Backend validates on protected endpoints
✅ **CORS Enabled**: Frontend/Backend communication secured
✅ **Environment Variables**: Secrets not in code
✅ **User Validation**: Email uniqueness, required fields

## Troubleshooting

### "MongoDB connection error"
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify network connection (if using Atlas)

### "Invalid token" on protected pages
- Clear browser cache
- Delete localStorage: Open DevTools > Application > Storage
- Log in again

### "Admin user already exists" when seeding
- Admin already created
- Use admin credentials to login
- To reset: Delete user from MongoDB manually

### CORS errors
- Backend CORS is enabled
- Ensure backend running on `http://127.0.0.1:8000`
- Check API URLs in frontend files

### "Login failed" after signup
- Wait a moment for database write
- Check MongoDB connection
- Verify no duplicate email

## Environment Variables

Create `.env` file in `backend/` folder:

```env
PORT=8000                                    # Backend port
MONGODB_URI=mongodb://localhost:27017/dressify  # MongoDB connection
JWT_SECRET=your_jwt_secret_key_change_this     # JWT signing key
NODE_ENV=development                           # Environment mode
```

## Next Steps

1. ✅ Setup complete - test login/signup flow
2. 🔒 Add role-based access control for admin features
3. 📧 Add email verification for signup
4. 🔑 Implement password reset functionality
5. 📱 Add OAuth integration (Google, Facebook)

## Support

For issues or questions, check:
- MongoDB documentation: https://docs.mongodb.com
- Express documentation: https://expressjs.com
- JWT documentation: https://jwt.io
