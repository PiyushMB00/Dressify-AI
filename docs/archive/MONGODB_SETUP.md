# MongoDB Installation & Setup Guide for Dressify AI

## 🎯 Step 1: Download & Install MongoDB

### Option A: Local MongoDB (Recommended for Development)

#### For Windows

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select **Windows** platform
   - Download the `.msi` installer (latest stable version, e.g., 7.x or 8.x)

2. **Run the Installer**
   - Double-click the downloaded `.msi` file
   - Accept the license agreement
   - Click **Next** through default settings
   - Choose **Complete** installation
   - On "MongoDB as a Service" screen:
     - ✅ Check "Install MongoDB as a Service"
     - Select **Run the MongoDB service**
     - Keep "Run MongoDB service after installation" checked
   - Click **Install**
   - Click **Finish**

3. **Verify Installation**
   ```powershell
   
   
   # Should output MongoDB version
   ```

4. **Start MongoDB Service**
   ```powershell
   # MongoDB should auto-start after installation
   # To manually start, open PowerShell as Admin:
   net start MongoDB
   ```

5. **Check if MongoDB is Running**
   ```powershell
   # Connect to MongoDB using MongoDB Shell (mongosh)
   mongosh
   # You should see a MongoDB shell prompt: test>
   # Type "exit" to quit
   ```

#### For macOS

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

#### For Linux (Ubuntu/Debian)

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Verify
mongosh
```

---

## 🎯 Step 2: Verify MongoDB is Running

Open PowerShell/Terminal and run:

```powershell
mongosh
```

Expected output:
```
MongoDB shell version v7.0.0
...
test>
```

Type `exit` to quit the shell.

---

## 🎯 Step 3: Configure Dressify AI Backend

### Step 3.1: Set MongoDB Connection String

Create a `.env` file in the `backend` folder:

```powershell
# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/dressify" > backend\.env
echo "JWT_SECRET=your_super_secret_key_12345" >> backend\.env
echo "PORT=8000" >> backend\.env
```

Or manually create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/dressify
JWT_SECRET=your_super_secret_key_12345
PORT=8000
```

### Step 3.2: Install Backend Dependencies

```powershell
cd backend
npm install
```

### Step 3.3: Start Backend Server

```powershell
node server.js
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Dressify Backend Server is running on http://127.0.0.1:8000
📡 CORS enabled for frontend development
```

---

## 🎯 Step 4: Seed Database with Admin & Products

### Step 4.1: Create Admin User

In a new PowerShell window (keep backend running):

```powershell
cd backend
node seed-admin.js
```

Expected output:
```
✅ MongoDB connected
✅ Admin user created successfully
Admin Email: shrvankad@gmail.com
Admin Password: Shrvan@45
```

### Step 4.2: Seed Products

```powershell
cd backend
node seed-products.js
```

Expected output:
```
✅ MongoDB connected
🗑️  Cleared existing products
✅ Successfully seeded 15 products
📦 Seeded Products:
1. Classic Cotton T-Shirt - ₹499 (Stock: 50)
2. Blue Denim Jeans - ₹1,499 (Stock: 35)
...
✨ Seeding complete!
```

---

## 🎯 Step 5: Start Frontend

In a new PowerShell window:

```powershell
cd "d:\Dressify Ai"
python -m http.server 3000
# Or if using Node.js:
# npx http-server -p 3000
```

Access at: **http://localhost:3000**

---

## 🎯 Step 6: Test Login/Signup

### Test Login

1. Open http://localhost:3000/login.html
2. Enter credentials:
   - Email: `shrvankad@gmail.com`
   - Password: `Shrvan@45`
3. Click **Login**
4. Should redirect to **home page** ✅

### Test Signup

1. Open http://localhost:3000/signup.html
2. Fill form:
   - Name: Your Name
   - Email: test@example.com
   - Password: Test123456
   - Confirm: Test123456
   - Check Terms & Conditions
3. Click **Create Account**
4. Should show success message ✅

---

## 🎯 Step 7: Test Product Upload & Image Storage

### Upload Product with Image

```powershell
# From any directory, run:
$imagePath = "C:\path\to\image.jpg"
$body = @{
    name = "Sample Shirt"
    description = "Beautiful shirt"
    price = 999
    category = "Tops"
    stock = 10
} | ConvertTo-Json

$form = @{
    image = Get-Item $imagePath
}

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/upload/upload" `
  -Method Post `
  -Form $form
```

Or use the frontend form (when enabled).

---

## ✅ Complete Setup Checklist

- [ ] Downloaded MongoDB Community Edition
- [ ] Ran `.msi` installer with default settings
- [ ] Service is running: `net start MongoDB` (Windows)
- [ ] Can connect: `mongosh` (shows prompt)
- [ ] Created `backend/.env` with connection string
- [ ] Ran `npm install` in backend folder
- [ ] Started backend: `node server.js` (shows ✅ MongoDB connected)
- [ ] Seeded admin: `node seed-admin.js`
- [ ] Seeded products: `node seed-products.js`
- [ ] Started frontend: `python -m http.server 3000`
- [ ] Tested login at http://localhost:3000/login.html
- [ ] Tested signup at http://localhost:3000/signup.html

---

## 🔍 Troubleshooting

### MongoDB won't start

**Problem**: `mongod: command not found`

**Solution**:
- Ensure MongoDB is installed: Download from mongodb.com
- Add MongoDB to PATH:
  - Windows: `C:\Program Files\MongoDB\Server\7.0\bin`
  - Restart PowerShell after adding to PATH

### Backend shows "MongoDB connection error"

**Problem**: 
```
❌ MongoDB connection error: connect ECONNREFUSED
```

**Solution**:
1. Check MongoDB is running:
   ```powershell
   mongosh
   ```
2. If not connected, start MongoDB:
   ```powershell
   net start MongoDB
   ```
3. Restart backend server

### Login page shows error

**Problem**: "Connection error. Please try again."

**Solution**:
1. Check backend is running on port 8000:
   ```powershell
   curl http://127.0.0.1:8000/health
   ```
2. Check browser console for CORS errors
3. Ensure `.env` has correct `MONGODB_URI`
4. Restart backend if you changed `.env`

### Products not showing on products page

**Problem**: "No products found"

**Solution**:
1. Verify products were seeded: `node seed-products.js`
2. Check MongoDB has data:
   ```powershell
   mongosh
   > use dressify
   > db.products.find()
   ```
3. Verify backend is running and connected to MongoDB

---

## 📊 MongoDB Database Structure

After seeding, your MongoDB will have:

### Collections

1. **users** - Stores user accounts
   ```javascript
   {
     fullname: "John Doe",
     email: "john@example.com",
     password: "hashed_password_bcrypt",
     isAdmin: false,
     createdAt: "2025-01-19T10:00:00Z"
   }
   ```

2. **products** - Stores all products
   ```javascript
   {
     name: "Classic Cotton T-Shirt",
     description: "...",
     price: 499,
     category: "Tops",
     images: ["/uploads/image-xxx.jpg"],
     stock: 50
   }
   ```

3. **orders** - Stores customer orders
   ```javascript
   {
     user: ObjectId("..."),
     items: [...],
     total: 5000,
     paymentStatus: "pending",
     status: "processing"
   }
   ```

4. **uploads** (GridFS) - Stores images in MongoDB

---

## 🖼️ Image Storage Options

### Option 1: File System (Current)
- Images stored in `backend/uploads/` folder
- Served via `/uploads/` endpoint
- Simpler but not scalable

### Option 2: MongoDB GridFS (Recommended)
- Images stored inside MongoDB
- Automatically replicated with database
- Better for cloud deployment

To enable GridFS, see `IMAGE_STORAGE.md` (coming soon)

---

## 🚀 Next Steps

1. Complete setup checklist above
2. Test login/signup on http://localhost:3000
3. Upload products with images
4. View admin dashboard at http://localhost:3000/admin.html
5. Create test orders and mark as paid

---

## 📞 Quick Reference

```powershell
# Check if MongoDB is running
mongosh

# Start MongoDB (Windows)
net start MongoDB

# Stop MongoDB (Windows)
net stop MongoDB

# Connect to Dressify database
mongosh
> use dressify
> db.users.find()
> db.products.find()
> db.orders.find()

# Start backend
cd backend
node server.js

# Seed admin
node seed-admin.js

# Seed products
node seed-products.js

# Start frontend
cd "d:\Dressify Ai"
python -m http.server 3000
```

---

For more help, check README.md or contact support.
