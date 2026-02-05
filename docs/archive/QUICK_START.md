# 🚀 Quick Start Guide - Dressify AI Authentication

## 5-Minute Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
**Local MongoDB:**
```bash
# Windows: Start MongoDB service
net start MongoDB

# Mac/Linux: 
mongod
```

**Or use MongoDB Atlas (cloud)** - no setup needed, just update `.env`

### Step 3: Start Backend Server
```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Dressify Backend Server is running on http://127.0.0.1:8000
```

### Step 4: Create Admin User
```bash
cd backend
node seed-admin.js
```

Expected output:
```
✅ Admin user created successfully!
Email: shrvankad@gmail.com
Password: Shrvan@45
```

### Step 5: Open Frontend
1. Open `index.html` in browser
2. You'll be redirected to `login.html`
3. Test the flow!

---

## 🧪 Test Scenarios

### Test 1: New User Signup
1. On login page, click "Sign Up"
2. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test@123`
   - Confirm: `Test@123`
3. Check Terms checkbox
4. Click "Sign Up"
5. ✅ Should see "Account created successfully" message
6. ✅ Should redirect to login page
7. Can now login with these credentials

### Test 2: Admin Login
1. On login page, enter:
   - Email: `shrvankad@gmail.com`
   - Password: `Shrvan@45`
2. Click "Login"
3. ✅ Should see "Login successful" message
4. ✅ Should redirect to home page
5. ✅ Should see "Logout" button in navigation

### Test 3: Regular User Login
1. On login page, enter any test user email/password
2. Click "Login"
3. ✅ Should redirect to home page
4. ✅ Navigation shows "Logout" button

### Test 4: Authentication Check
1. After logging in, manually go to `login.html`
2. You should NOT see login form (redirected to home)
3. Go to `signup.html`
4. Should NOT see signup form (redirected to home)

### Test 5: Logout
1. After logging in, click "Logout" button
2. ✅ Should see confirmation dialog
3. Click "OK"
4. ✅ Should redirect to login page
5. Try to go to `index.html` directly
6. ✅ Should redirect to login page

### Test 6: Invalid Credentials
1. On login page, enter:
   - Email: `nonexistent@example.com`
   - Password: `WrongPassword`
2. Click "Login"
3. ✅ Should see "Invalid email or password" error

### Test 7: Duplicate Email Signup
1. Try to signup with an email that already exists
2. ✅ Should see "Email already registered" error

### Test 8: Password Mismatch
1. On signup page, enter different password and confirm password
2. Click "Sign Up"
3. ✅ Should see "Passwords do not match" error

### Test 9: Missing Terms & Conditions
1. On signup page, fill all fields but DON'T check terms
2. Click "Sign Up"
3. ✅ Should see "Please accept the Terms & Conditions" error

### Test 10: Token Persistence
1. Login as a user
2. Refresh the page (F5)
3. ✅ Should stay on home page (not redirect to login)
4. ✅ User info should still be visible
5. Close browser tab and reopen
6. ✅ Should redirect to login (session ended)

---

## 🔍 Database Verification

### Check Created Users
```bash
# Connect to MongoDB
mongo

# or if using MongoDB Compass GUI, connect to:
# mongodb://localhost:27017/dressify

# View users
use dressify
db.users.find().pretty()

# Example output:
# {
#   "_id": ObjectId("..."),
#   "fullname": "Admin Shrvan",
#   "email": "shrvankad@gmail.com",
#   "password": "$2a$10$...",
#   "isAdmin": true,
#   "createdAt": ISODate("2024-01-19T...")
# }
```

---

## 📱 API Testing with Postman

### Test Signup
```
POST http://127.0.0.1:8000/api/auth/signup
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Test Login
```
POST http://127.0.0.1:8000/api/auth/login
Content-Type: application/json

{
  "email": "shrvankad@gmail.com",
  "password": "Shrvan@45"
}
```

### Test Verify Token
```
POST http://127.0.0.1:8000/api/auth/verify
Content-Type: application/json
Authorization: Bearer {paste_token_here}
```

### Get All Users
```
GET http://127.0.0.1:8000/api/auth/users
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "MongoDB connection error" | Ensure MongoDB is running: `mongod` |
| "Cannot GET /api/auth/login" | Backend not started or wrong URL |
| "CORS error" | Backend CORS is enabled, check URL is correct |
| "Invalid token" on refresh | Clear localStorage in DevTools, login again |
| Admin user already exists | Already created, try logging in with admin creds |
| Signup redirects to login but can't login | Wait 1-2 seconds after signup, MongoDB might be slow |

---

## ✅ Checklist After Setup

- [ ] MongoDB is running
- [ ] Backend server started on port 8000
- [ ] Admin user created with `seed-admin.js`
- [ ] Can open `index.html` and get redirected to login
- [ ] Can signup with new email
- [ ] Can login as admin (shrvankad@gmail.com / Shrvan@45)
- [ ] Can see logout button after login
- [ ] Can logout and redirect to login
- [ ] Can't access home page without login token

---

## 📚 Files Modified/Created

### New Files
- ✅ `backend/models/User.js` - MongoDB User schema
- ✅ `backend/seed-admin.js` - Admin seeder script
- ✅ `auth-utils.js` - Frontend auth utilities
- ✅ `AUTHENTICATION_SETUP.md` - Full documentation
- ✅ `QUICK_START.md` - This file

### Modified Files
- ✅ `backend/server.js` - Added MongoDB connection
- ✅ `backend/routes/auth.js` - Updated to use MongoDB
- ✅ `login.js` - Updated API endpoints
- ✅ `signup.js` - Updated API endpoints
- ✅ `index.html` - Added auth check and logout button

---

## 🎯 Next Steps

1. Explore the admin dashboard (to be created)
2. Add role-based features
3. Implement password reset
4. Add email verification
5. Setup production deployment

Enjoy! 🎨
