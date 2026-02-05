# AI Hub MongoDB Setup - Quick Start & Testing Guide

## ✅ What Has Been Created

### 1. **MongoDB Models** (3 files)
- ✅ `backend/models/Recommendation.js` - Stores fashion recommendations
- ✅ `backend/models/AIChat.js` - Stores chat conversations
- ✅ `backend/models/AIHubImage.js` - Stores image metadata

### 2. **Backend API Routes**
- ✅ `backend/routes/ai-hub.js` - Complete AI Hub REST API with 20+ endpoints

### 3. **Server Configuration**
- ✅ Updated `backend/server.js` to include AI Hub routes at `/api/ai-hub`

### 4. **Frontend Integration**
- ✅ Updated `ai-hub.html` with database connectivity

---

## 🚀 Quick Start - Testing the System

### Step 1: Ensure MongoDB is Running

**Windows:**
```powershell
# Check if MongoDB is running
mongo --version

# Start MongoDB service
net start MongoDB

# Or if using MongoDB Community Edition with custom path:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

**Linux/Mac:**
```bash
# Start MongoDB
mongod

# Or as a service
sudo systemctl start mongod
```

### Step 2: Start the Backend Server

```bash
cd backend
npm install  # Install any missing dependencies
node server.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 Dressify Backend Server is running on http://127.0.0.1:8000
```

### Step 3: Test via Browser or API Client

Open `ai-hub.html` in your browser and test the features:
1. Upload an image
2. Get AI recommendations
3. Chat with AI
4. All data will be saved to MongoDB

---

## 📊 Database Structure Summary

### Collection 1: `recommendations`
```javascript
{
  userId: "user123",
  preferences: "Casual, comfortable",
  budget: "$50-$100",
  style: "Casual",
  occasion: "Everyday Wear",
  recommendations: [
    {
      name: "Blue Casual Shirt",
      category: "Tops",
      description: "...",
      color: "Blue",
      price: "$45"
    }
  ],
  rating: 5,
  feedback: "Great recommendations!",
  createdAt: "2026-02-01T10:00:00Z"
}
```

### Collection 2: `ai_chats`
```javascript
{
  userId: "user123",
  conversationId: "conv123",
  messages: [
    {
      role: "user",
      message: "What colors go with blue?",
      timestamp: "2026-02-01T10:00:00Z"
    },
    {
      role: "assistant",
      message: "Blue pairs well with white, gray...",
      timestamp: "2026-02-01T10:00:05Z"
    }
  ],
  topic: "Fashion Advice",
  status: "active",
  createdAt: "2026-02-01T10:00:00Z"
}
```

### Collection 3: `ai_hub_images`
```javascript
{
  userId: "user123",
  filename: "image-123.jpg",
  originalName: "my-outfit.jpg",
  filepath: "/uploads/image-123.jpg",
  filesize: 245000,
  mimetype: "image/jpeg",
  analysis: {
    colors: ["blue", "white"],
    clothingType: "casual wear",
    style: "minimalist"
  },
  status: "uploaded",
  uploadedAt: "2026-02-01T10:00:00Z"
}
```

---

## 🧪 Testing Individual Endpoints

### Using cURL or Postman

#### 1. Create a Recommendation
```bash
curl -X POST http://127.0.0.1:8000/api/ai-hub/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "preferences": "Casual, comfortable, trendy",
    "budget": "$50-$100",
    "style": "Casual",
    "occasion": "Everyday Wear"
  }'
```

#### 2. Get Recommendation History
```bash
curl http://127.0.0.1:8000/api/ai-hub/recommendations/user123?limit=10
```

#### 3. Send Chat Message
```bash
curl -X POST http://127.0.0.1:8000/api/ai-hub/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "What colors go well with my skin tone?"
  }'
```

#### 4. Get Chat History
```bash
curl http://127.0.0.1:8000/api/ai-hub/chat-history/user123?limit=10
```

#### 5. Save Image Metadata
```bash
curl -X POST http://127.0.0.1:8000/api/ai-hub/image/metadata \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "filename": "outfit-1.jpg",
    "originalName": "my-outfit.jpg",
    "filepath": "/uploads/outfit-1.jpg",
    "filesize": 245000,
    "mimetype": "image/jpeg"
  }'
```

#### 6. Get User Statistics
```bash
curl http://127.0.0.1:8000/api/ai-hub/stats/user123
```

#### 7. Rate a Recommendation
```bash
curl -X PUT http://127.0.0.1:8000/api/ai-hub/recommendation/{recommendationId}/rate \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "feedback": "Great suggestions!"
  }'
```

---

## 🔍 Verify Data in MongoDB

### Using MongoDB Shell

```bash
# Connect to MongoDB
mongo

# Select database
use dressify

# Check collections
show collections

# View recommendation documents
db.recommendations.find().pretty()

# View chat documents
db.ai_chats.find().pretty()

# View image documents
db.ai_hub_images.find().pretty()

# Count documents
db.recommendations.countDocuments()
db.ai_chats.countDocuments()
db.ai_hub_images.countDocuments()

# Find recommendations for specific user
db.recommendations.find({ userId: "user123" }).pretty()

# Get recent recommendations
db.recommendations.find().sort({ createdAt: -1 }).limit(5).pretty()
```

---

## 📱 Frontend Usage

### Auto-loaded Features

When you open `ai-hub.html`, it automatically:
1. ✅ Loads your recommendation history
2. ✅ Loads your chat history  
3. ✅ Loads your user statistics
4. ✅ Uses your userId from localStorage (or defaults to 'user123')

### User ID Management

To set a specific user ID:
```javascript
// In browser console
localStorage.setItem('userId', 'your-user-id');

// Refresh page to load as new user
location.reload();
```

### Manual API Testing in Browser Console

```javascript
// Get recommendations history
fetch('http://127.0.0.1:8000/api/ai-hub/recommendations/user123')
  .then(r => r.json())
  .then(d => console.log(d))

// Get user stats
fetch('http://127.0.0.1:8000/api/ai-hub/stats/user123')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Check if MongoDB is running
# Windows
netstat -ano | findstr :27017

# Linux/Mac
lsof -i :27017

# Start MongoDB if not running
mongod
```

### Issue: "Cannot POST /api/ai-hub/recommendations"
**Solution:**
- Verify server.js includes the ai-hub routes
- Check backend is running on port 8000
- Verify the file `backend/routes/ai-hub.js` exists

### Issue: "Models not found"
**Solution:**
```bash
# Verify model files exist:
# - backend/models/Recommendation.js
# - backend/models/AIChat.js
# - backend/models/AIHubImage.js

# Clear node_modules and reinstall
rm -rf backend/node_modules
npm install --prefix backend
```

### Issue: "Data not saving"
**Solution:**
1. Check MongoDB is connected (see console output)
2. Verify userId is being sent in requests
3. Check browser console for fetch errors
4. Check backend console for error messages

---

## 📈 Expected Data Flow

```
User uploads image/gets recommendation/sends message
           ↓
Frontend sends POST to /api/ai-hub/...
           ↓
Backend calls Python Gemini API (optional)
           ↓
Backend saves to MongoDB
           ↓
MongoDB stores document with timestamp
           ↓
Frontend receives success response with ID
           ↓
Data persists in database for future retrieval
```

---

## 🔐 Security Notes

1. **User ID**: Currently hardcoded to "user123" for testing
   - Replace with authenticated user ID from session/token
   
2. **Validation**: All inputs are validated before saving
   - Add rate limiting in production
   - Add authentication middleware
   - Add authorization checks

3. **Data Privacy**: 
   - Currently any user can access any other user's data
   - Implement user authentication before production use

---

## 📊 Database Indexes

All collections have optimized indexes:

```javascript
// recommendations
db.recommendations.getIndexes()
// Indexes: userId+createdAt, style+occasion

// ai_chats
db.ai_chats.getIndexes()
// Indexes: userId+createdAt, conversationId, userId+status

// ai_hub_images
db.ai_hub_images.getIndexes()
// Indexes: userId+uploadedAt, status, analysis.style
```

---

## 🎯 Next Steps for Production

- [ ] Replace 'user123' with real user authentication
- [ ] Add rate limiting (npm install express-rate-limit)
- [ ] Add input validation (npm install joi)
- [ ] Add authentication middleware
- [ ] Set up database backups
- [ ] Add error logging (npm install winston)
- [ ] Add API documentation (Swagger)
- [ ] Deploy to production server
- [ ] Set up database indexing strategy
- [ ] Configure environment variables

---

## 📞 API Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ai-hub/recommendations` | Create recommendation |
| GET | `/api/ai-hub/recommendations/:userId` | Get user recommendations |
| GET | `/api/ai-hub/recommendation/:id` | Get single recommendation |
| PUT | `/api/ai-hub/recommendation/:id/rate` | Rate recommendation |
| DELETE | `/api/ai-hub/recommendation/:id` | Delete recommendation |
| POST | `/api/ai-hub/chat` | Send chat message |
| GET | `/api/ai-hub/chat-history/:userId` | Get chat history |
| GET | `/api/ai-hub/chat/:conversationId` | Get conversation |
| PUT | `/api/ai-hub/chat/:conversationId/archive` | Archive chat |
| DELETE | `/api/ai-hub/chat/:conversationId` | Delete chat |
| POST | `/api/ai-hub/image/metadata` | Save image metadata |
| GET | `/api/ai-hub/images/:userId` | Get user images |
| PUT | `/api/ai-hub/image/:imageId/analysis` | Update image analysis |
| DELETE | `/api/ai-hub/image/:imageId` | Delete image |
| GET | `/api/ai-hub/stats/:userId` | Get user statistics |
| GET | `/api/ai-hub/search/recommendations` | Search recommendations |

---

**Status:** ✅ Ready for Testing
**Created:** February 1, 2026
**Database:** MongoDB (dressify)
**Collections:** 3 (recommendations, ai_chats, ai_hub_images)
