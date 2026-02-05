# 🎨 Complete MongoDB User Profile & AI Recommendation System

## Overview

This is a **complete end-to-end solution** for storing user profiles, AI recommendations, chat histories, and uploaded images in MongoDB. All user data persists in the database and is linked to personalized AI recommendations.

---

## 📊 Database Architecture

### Collections Created:

#### 1. **UserProfile Collection**
Stores comprehensive user information including:
- **Personal Info**: Name, email, age, gender, height
- **Body & Appearance**: Body shape, skin tone
- **Fashion Preferences**: 
  - Primary style (Casual, Formal, Business, etc.)
  - Secondary styles
  - Favorite colors
  - Fabric preferences
  - Comfort level
- **Budget Information**:
  - Monthly budget
  - Per-item budget
- **Wardrobe**:
  - Essential items
  - Favorite pieces with brands
  - Total item count
- **Sustainability & Allergies**
- **Account Status**: Profile completion, last active date

#### 2. **Recommendation Collection**
Stores AI-generated fashion recommendations with:
- Style, occasion, budget
- Personalized recommendations array
- Rating and feedback
- User preferences snapshot
- Status tracking

#### 3. **AIChat Collection**
Stores conversation history:
- Multiple messages per conversation
- Role-based (user/assistant)
- Conversation topics
- Context information
- Status (active, archived, closed)

#### 4. **AIHubImage Collection**
Stores uploaded image metadata:
- File information
- AI analysis results
- Color extraction
- Clothing type detection
- Style and occasion suggestions

---

## 🚀 Features Implemented

### ✅ User Profile Management
```
POST /api/user/profile
- Save complete user profile
- Update existing profiles
- Auto-complete tracking

GET /api/user/profile/:userId
- Retrieve full user profile
- Populate related recommendations & images
- Track last active time

PUT /api/user/preferences/:userId
- Update fashion preferences
- Update budget settings
- Update style information

GET /api/user/stats/:userId
- View user statistics
- Track recommendation count
- Track image uploads
- View favorite styles
```

### ✅ AI Recommendations Linked to Users
```
POST /api/ai-hub/recommendations
- Create recommendation based on user profile
- Store in MongoDB with user ID
- Return recommendation ID for saving

GET /api/ai-hub/recommendations/:userId
- Retrieve all recommendations for a user
- Filter by style, occasion, budget
- View recommendation history
```

### ✅ Chat with History
```
POST /api/ai-hub/chat
- Start new conversation or continue existing
- Store messages with user context
- Link to user profile

GET /api/ai-hub/chat-history/:userId
- Retrieve all conversations
- View conversation details
- Search by topic
```

### ✅ Image Upload with Analysis
```
POST /api/ai-hub/image/metadata
- Save uploaded image metadata
- Store analysis results
- Link to user profile
```

---

## 📝 Sample User Data

Pre-seeded sample users for testing:

### User 1: Sarah Anderson (user-demo-1)
- **Style**: Minimalist
- **Budget**: $100-$200 monthly
- **Favorites**: Navy, White, Professional
- **Has**: 1 Recommendation, 1 Uploaded Image, 1 Chat

### User 2: Alex Johnson (user-demo-2)
- **Style**: Casual
- **Budget**: $50-$100 monthly
- **Favorites**: Gray, Black, Comfortable
- **Has**: 1 Recommendation, Chat history

### User 3: Emma Williams (user-demo-3)
- **Style**: Bohemian
- **Budget**: $200+ monthly
- **Favorites**: Burgundy, Forest Green, Sustainable
- **Has**: 1 Recommendation, 1 Uploaded Image, 1 Chat

---

## 🎯 User Flow

### 1. **Complete Profile** (First Time)
```
User opens ai-hub-new.html
↓
Profile Modal opens automatically
↓
User enters: Name, Email, Style, Body Shape, Preferences, Budget
↓
Profile saved to MongoDB
↓
User badge updated with name
↓
Ready to get recommendations
```

### 2. **Get AI Recommendations**
```
User fills: Occasion, Style, Budget, Preferences
↓
POST /api/user/profile (update preferences)
↓
POST /api/ai-hub/recommendations (create recommendation)
↓
Recommendation saved to MongoDB with user ID
↓
Display results with recommendation ID
```

### 3. **Chat with Fashion AI**
```
User types question
↓
POST /api/ai-hub/chat (save message & response)
↓
Chat stored with user ID & conversation ID
↓
Continue conversation in same thread
↓
History persists in MongoDB
```

### 4. **Upload Fashion Images**
```
User selects image
↓
POST /api/upload/upload (save image file)
↓
POST /api/ai-hub/image/metadata (save metadata)
↓
Image linked to user profile
↓
Metadata stored with analysis results
```

---

## 🔧 API Endpoints Reference

### User Profile Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/user/profile` | Create/update user profile |
| GET | `/api/user/profile/:userId` | Get user profile |
| GET | `/api/user/all` | Get all users (admin) |
| PUT | `/api/user/preferences/:userId` | Update preferences |
| POST | `/api/user/save-recommendation/:userId` | Save recommendation |
| GET | `/api/user/stats/:userId` | Get user statistics |
| DELETE | `/api/user/profile/:userId` | Delete user account |
| GET | `/api/user/search/style/:style` | Search users by style |

### Recommendation Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ai-hub/recommendations` | Create recommendation |
| GET | `/api/ai-hub/recommendations/:userId` | Get user recommendations |
| GET | `/api/ai-hub/recommendations/:id` | Get single recommendation |
| PUT | `/api/ai-hub/recommendations/:id/rate` | Rate recommendation |

### Chat Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ai-hub/chat` | Send chat message |
| GET | `/api/ai-hub/chat-history/:userId` | Get chat history |
| GET | `/api/ai-hub/chat/:conversationId` | Get conversation details |

---

## 📊 Database Query Examples

### Find user and their recommendations:
```javascript
db.userprofiles.findOne({ userId: 'user-demo-1' })
  .populate('savedRecommendations')
```

### Find all minimalist style recommendations:
```javascript
db.recommendations.find({ 'fashionProfile.primaryStyle': 'Minimalist' })
```

### Find conversations for a user:
```javascript
db.aichats.find({ userId: 'user-demo-1' })
```

### Get user statistics:
```javascript
db.userprofiles.findOne({ userId: 'user-demo-1' }, { stats: 1 })
```

---

## 🚀 Getting Started

### 1. **Start MongoDB**
```powershell
mongod --dbpath "C:\data\db"
```

### 2. **Start Backend Server**
```powershell
cd backend
npm start
```

### 3. **Open Frontend**
Navigate to: `http://127.0.0.1:8000/ai-hub-new.html`

### 4. **Test with Sample Data**
Use pre-created user IDs:
- `user-demo-1`
- `user-demo-2`
- `user-demo-3`

Or create your own:
- Click "Profile" button
- Fill in your information
- System will auto-generate unique user ID

---

## 💾 Data Persistence

### All data automatically saved:
✅ User profiles (auto-updated)
✅ Fashion recommendations (linked to user)
✅ Chat messages (with conversation threading)
✅ Uploaded images (with metadata)
✅ User statistics (auto-tracked)
✅ Preferences & settings (real-time sync)

### Automatic tracking:
- Last active timestamp
- Total recommendations count
- Total images uploaded
- Favorite styles
- Average rating
- Profile completion status

---

## 🎨 Frontend Features

### Profile Management
- Modal form for complete profile data
- Edit profile anytime
- Auto-save on submit
- User badge with name

### Recommendations Engine
- Get personalized recommendations based on:
  - Body shape & skin tone
  - Favorite colors
  - Style preference
  - Occasion & budget
  - Additional preferences

- All recommendations saved to MongoDB
- View recommendation ID for future reference
- Rate recommendations

### Chat Interface
- Multi-message conversations
- Persist conversation IDs
- Continue previous conversations
- View full chat history

### Image Upload
- Drag-and-drop interface
- Preview before upload
- Auto-save to database
- Metadata stored with image

---

## 🧪 Testing Checklist

### ✅ User Profile
- [ ] Create new user profile
- [ ] Update existing profile
- [ ] View profile with all data
- [ ] See user badge updated
- [ ] Check MongoDB for stored data

### ✅ Recommendations
- [ ] Get recommendations for user
- [ ] Verify data saved to MongoDB
- [ ] Check user stats updated
- [ ] View recommendation history

### ✅ Chat
- [ ] Send chat message
- [ ] Start new conversation
- [ ] Continue conversation with same ID
- [ ] View chat history in MongoDB

### ✅ Image Upload
- [ ] Upload image
- [ ] View image metadata in database
- [ ] Check uploaded image collection

---

## 📁 Files Created/Modified

### New Models
- `backend/models/UserProfile.js` - Complete user profile schema

### New Routes
- `backend/routes/user-profile.js` - All user CRUD operations

### New Frontend
- `ai-hub-new.html` - Enhanced with user profile & database integration

### Seed Data
- `backend/seed-users.js` - Pre-populate database with sample data

### Modified Backend
- `backend/server.js` - Added user-profile routes

---

## 🔐 User Data Fields Stored

| Category | Fields |
|----------|--------|
| Basic Info | firstName, lastName, email, age, gender |
| Physical | bodyShape, skinTone, height |
| Style | primaryStyle, secondaryStyles, occasions |
| Preferences | favoriteColors, fabricPreferences, comfort |
| Budget | monthly, perItem |
| Wardrobe | essentials, itemCount, favorites |
| Account | isProfileComplete, createdAt, updatedAt, lastActive |
| Relationships | savedRecommendations[], uploadedImages[], chatHistory[] |

---

## 📈 Statistics Tracked

- `totalRecommendations` - Count of recommendations
- `totalImagesUploaded` - Number of uploaded images
- `totalChats` - Conversation count
- `favoriteStyle` - Most used style
- `averageRating` - Average recommendation rating
- `memberSince` - Account creation date
- `lastActive` - Last activity timestamp

---

## ✨ Success Indicators

✅ **Database Ready**: MongoDB connected and running
✅ **Backend Running**: Server on http://127.0.0.1:8000
✅ **Sample Data Seeded**: 3 users with recommendations & chats
✅ **Frontend Working**: ai-hub-new.html loads without errors
✅ **All Features Functional**: 
  - Profile creation/update
  - Recommendation generation & storage
  - Chat with persistence
  - Image upload & metadata storage
✅ **Data Persists**: All information stored in MongoDB

---

## 🎯 Next Steps

1. **Test the system** using the sample user IDs
2. **Create your own profile** with personal information
3. **Get recommendations** and watch them save to MongoDB
4. **Chat with AI** and see history persist
5. **Upload images** and view metadata in database
6. **Verify data** in MongoDB using MongoDB Compass or mongosh

---

## 📞 Support

**Backend Server**: http://127.0.0.1:8000
**MongoDB**: mongodb://localhost:27017/dressify
**Frontend**: http://127.0.0.1:8000/ai-hub-new.html

All user data is automatically stored in MongoDB and linked through user IDs!
