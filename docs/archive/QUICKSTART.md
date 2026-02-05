# 🚀 Dressify AI - Quick Start Guide

## Prerequisites
- **Windows/Mac/Linux** with internet connection
- **Node.js** (v14+) - Download from https://nodejs.org/
- **MongoDB** - Download from https://www.mongodb.com/try/download/community
- **Python 3** (for running HTTP server)

---

## ⚡ 5-Minute Setup

### Step 1: Download & Install MongoDB

#### **Windows (.msi installer)**
1. Download from: https://www.mongodb.com/try/download/community
2. Double-click the `.msi` file
3. Click **Next** through all screens
4. Check "Run MongoDB as a Service"
5. Click **Install**
6. MongoDB will auto-start ✅

#### **Verify MongoDB is Running**
```powershell
mongosh
# Should show: test>
# Type: exit
```

---

### Step 2: Setup Dressify Backend

```powershell
# Navigate to project
cd "d:\Dressify Ai"

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/dressify" > backend\.env
echo "JWT_SECRET=my_secret_key" >> backend\.env
echo "PORT=8000" >> backend\.env

# Install dependencies
cd backend
npm install

# Seed database
node seed-admin.js
# Should show: ✅ Admin user created successfully

node seed-products.js
# Should show: ✅ Successfully seeded 15 products

# Start backend server
node server.js
# Should show: ✅ MongoDB connected successfully
#            🚀 Dressify Backend Server is running on http://127.0.0.1:8000
```

**Keep this terminal running!**

---

### Step 3: Setup Frontend

Open a **new PowerShell window** and run:

```powershell
cd "d:\Dressify Ai"

# Start HTTP server
python -m http.server 3000
# Should show: Serving HTTP on 0.0.0.0 port 3000
```

**Keep this terminal running too!**

---

### Step 4: Test Everything

Open your browser and visit these URLs:

#### **Test Login**
- URL: http://localhost:3000/login.html
- Email: `shrvankad@gmail.com`
- Password: `Shrvan@45`
- Should redirect to home page ✅

#### **Test Signup**
- URL: http://localhost:3000/signup.html
- Fill the form and create an account ✅

#### **View Products**
- URL: http://localhost:3000/products.html
- Shows 15 clothing items ✅

#### **Upload Product Image**
- URL: http://localhost:3000/products.html
- Upload an image file
- Should store in MongoDB ✅

#### **Admin Dashboard**
- URL: http://localhost:3000/admin.html
- Login with admin account (see above)
- Shows all customer orders ✅

---

## 📋 Features Enabled

✅ **Login/Signup** - User authentication with MongoDB  
✅ **Products Catalog** - 15 sample clothing items  
✅ **Image Upload** - Store images in MongoDB  
✅ **Admin Dashboard** - Manage orders  
✅ **Shopping Cart** - Add items to cart  
✅ **Order Management** - Create and track orders  

---

## 🐛 Troubleshooting

### MongoDB won't connect
```powershell
# Check if MongoDB is running
mongosh

# If not, start it
net start MongoDB
```

### Backend shows error
```powershell
# Make sure .env file exists in backend folder
# Check MONGODB_URI is correct: mongodb://localhost:27017/dressify

# Restart backend:
cd "d:\Dressify Ai\backend"
node server.js
```

### Login shows "Connection error"
1. Check backend is running (should see "✅ MongoDB connected" message)
2. Check port 8000 is not blocked by firewall
3. Check `.env` file exists in `backend/` folder
4. Restart both backend and frontend

### Products page is empty
1. Verify products were seeded: `node seed-products.js`
2. Check backend is running
3. Check browser console for errors (F12)

---

## 📝 Default Admin Account

- **Email**: shrvankad@gmail.com
- **Password**: Shrvan@45

This account is created automatically with `node seed-admin.js`

---

## 🔗 All URLs

| Feature | URL |
|---------|-----|
| Home | http://localhost:3000/ |
| Login | http://localhost:3000/login.html |
| Signup | http://localhost:3000/signup.html |
| Products | http://localhost:3000/products.html |
| AI Hub | http://localhost:3000/ai-hub.html |
| Avatar Creator | http://localhost:3000/avatar-customizer.html |
| Chat | http://localhost:3000/gemini_chatbot.html |
| Admin Dashboard | http://localhost:3000/admin.html |

---

## 📊 Database Info

### Collections (stored in MongoDB)
- **users** - User accounts & login info
- **products** - All products with images
- **orders** - Customer orders
- **files** - Uploaded images (GridFS)

### Connect to MongoDB
```powershell
mongosh
> use dressify
> db.users.find()          # View users
> db.products.find()       # View products
> db.orders.find()         # View orders
> db.files.find()          # View uploaded images
```

---

## 📱 Available Endpoints

### Auth API
```
POST /api/auth/signup      - Create account
POST /api/auth/login       - Login user
POST /api/auth/verify      - Check token validity
POST /api/auth/logout      - Logout
```

### Products API
```
GET  /api/products         - List all products
GET  /api/products/suggest - Get suggestions
GET  /api/products/:id     - Get single product
```

### Orders API
```
POST /api/orders/create    - Create new order
GET  /api/orders           - View my orders (or all if admin)
POST /api/orders/:id/pay   - Mark order as paid
```

### Upload API
```
POST /api/upload/upload         - Upload single image
POST /api/upload/upload-multiple - Upload multiple images
GET  /api/upload/images         - List all images
GET  /api/upload/image/:id      - View image by ID
DELETE /api/upload/image/:id    - Delete image
```

---

## 🎓 Test Scenarios

### Scenario 1: New User Signup
1. Go to http://localhost:3000/signup.html
2. Enter email, password, name
3. Click "Create Account"
4. Should be logged in automatically

### Scenario 2: Admin Login
1. Go to http://localhost:3000/login.html
2. Email: shrvankad@gmail.com
3. Password: Shrvan@45
4. Click Login
5. Should redirect to http://localhost:3000/admin.html

### Scenario 3: Browse Products
1. Go to http://localhost:3000/products.html
2. See 15 clothing items
3. Click "Add to Cart" on any item
4. Item saved to browser localStorage

### Scenario 4: Upload Image
1. Go to http://localhost:3000/products.html
2. In "Upload Product Image" section
3. Select any JPG/PNG file
4. Click "Upload to MongoDB"
5. Should show success message with image ID

---

## 🔐 Security Notes

- Passwords are hashed with bcryptjs (not stored as plain text)
- JWT tokens expire after 24 hours
- Admin-only routes check for isAdmin flag
- Images are validated (only image files allowed)
- API uses CORS for frontend access

---

## 📞 Support

For issues or questions, check:
1. [MONGODB_SETUP.md](MONGODB_SETUP.md) - Detailed MongoDB guide
2. [ECOMMERCE_GUIDE.md](ECOMMERCE_GUIDE.md) - E-commerce features
3. [README.md](README.md) - General documentation

---

**All set! Happy shopping! 🛍️**
