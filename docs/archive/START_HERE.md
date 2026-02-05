# 🎯 Quick Reference - Get Started in 5 Minutes

## Step 1️⃣: Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod

# Or use MongoDB Atlas (no installation needed)
```

## Step 2️⃣: Start Backend
```bash
cd backend
npm install
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Dressify Backend Server is running on http://127.0.0.1:8000
```

## Step 3️⃣: Create Admin User
```bash
cd backend
node seed-admin.js
```

**Expected output:**
```
✅ Admin user created successfully!
Email: shrvankad@gmail.com
Password: Shrvan@45
```

## Step 4️⃣: Open Website
Open `index.html` in browser

## Step 5️⃣: Test Login
- **Email**: shrvankad@gmail.com
- **Password**: Shrvan@45
- Click "Login"
- ✅ You should see home page!

---

## 🚨 If Something Doesn't Work

### Backend won't start?
```bash
# Make sure dependencies are installed
npm install

# Make sure MongoDB is running
mongo  # or mongod in another terminal
```

### MongoDB connection error?
```bash
# If using local MongoDB, start it:
mongod

# If using Atlas, update backend/.env:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dressify
```

### Can't login even with admin credentials?
```bash
# Recreate admin user
cd backend
node seed-admin.js

# If still error, check MongoDB is connected:
mongo
use dressify
db.users.find()
```

### Stuck on login page after opening index.html?
```
This is normal behavior! You MUST be logged in to access pages.
Use signup or login credentials to proceed.
```

---

## 📋 Admin Credentials

**Always available after running seed-admin.js:**
- Email: `shrvankad@gmail.com`
- Password: `Shrvan@45`
- Role: Admin

---

## 🔑 Key Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Start backend server |
| `npm run dev` | Start with auto-reload |
| `node seed-admin.js` | Create admin user |
| `mongo` | Connect to MongoDB |

---

## 📍 Ports & URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | `http://localhost:5000` | 5000 |
| Backend | `http://127.0.0.1:8000` | 8000 |
| MongoDB | `mongodb://localhost:27017` | 27017 |

---

## ✅ Success Indicators

✅ Backend shows "✅ MongoDB connected successfully"
✅ Backend shows "🚀 Dressify Backend Server is running"
✅ Admin user script shows "✅ Admin user created successfully!"
✅ Opening index.html redirects to login.html
✅ Can login with admin credentials
✅ See home page after login
✅ See "Logout" button in navigation
✅ Clicking logout redirects to login page

---

## 💡 Pro Tips

1. **First visitor flow**: User → login page (automatic redirect)
2. **After signup**: Automatically logged in and redirected to home
3. **After logout**: All data cleared from browser
4. **Refresh page**: Token stays valid for 24 hours
5. **New browser tab**: Same token works everywhere
6. **Close browser**: Session ends, must login again next time

---

## 🎮 Quick Test

```javascript
// Open browser DevTools (F12) and run in Console:

// Check if logged in
localStorage.getItem('authToken')  // Should show token if logged in

// See user info
JSON.parse(localStorage.getItem('user'))  // Shows logged in user

// Simulate logout
localStorage.clear()  // Clear all data
location.reload()  // Reload page (goes to login)
```

---

## 🆘 Common Errors & Quick Fixes

```
Error: "Cannot connect to MongoDB"
Fix: Start MongoDB (mongod) in another terminal

Error: "Cannot POST /api/auth/login"
Fix: Backend not running (npm start)

Error: "Email already registered"
Fix: Use different email or admin@example.com

Error: "Passwords do not match"
Fix: Confirm password must match password field

Error: "Stuck on login page"
Fix: Clear localStorage in DevTools → Application → Clear Site Data
```

---

## 📞 Still Need Help?

1. Check **QUICK_START.md** for detailed scenarios
2. Check **AUTHENTICATION_SETUP.md** for complete docs
3. Check **SETUP_COMPLETE.md** for system overview

All documentation is in the root folder! 📁

---

**You're all set! Happy coding! 🎨**
