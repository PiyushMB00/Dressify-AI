# 🎨 Dressify AI - Complete Setup Guide

## Architecture Overview

```
┌─────────────────┐
│  Frontend       │ (Port 3000)
│  - ai-hub.html  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
┌───▼───┐   ┌──▼────┐
│Node.js│   │Python │
│ Server│   │Server │
│(8000) │   │(8001) │
└───┬───┘   └──┬────┘
    │          │
    └────┬─────┘
         │
    ┌────▼──────┐
    │ MongoDB    │
    │ (27017)    │
    └────────────┘
```

## Required Services

### 1. **Node.js Backend (Port 8000)**
- Handles user authentication
- Manages product recommendations
- Stores data in MongoDB
- Serves API endpoints

### 2. **Python Backend (Port 8001)**
- Handles AI/Gemini responses
- Uses OpenAI GPT-4o/GPT-3.5
- Provides fashion recommendations

### 3. **Frontend Server (Port 3000)**
- Serves HTML files
- Connects to both backends

### 4. **MongoDB (Port 27017)**
- Stores user data
- Stores recommendations
- Stores chat history

## Setup Instructions

### Step 1: Install Dependencies

#### Python Dependencies
```bash
cd "e:\DRESSIFY AI NEW\Dressify Ai\Dressify Ai\backend"
pip install flask flask-cors openai python-dotenv
```

#### Node.js Dependencies
```bash
cd "e:\DRESSIFY AI NEW\Dressify Ai"
npm install express cors dotenv body-parser mongoose
```

### Step 2: Configure API Keys

**Get your API keys:**

1. **OpenAI API Key** (RECOMMENDED - GPT-4o is best)
   - Go to: https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key

2. **Alternative: Google Gemini API Key**
   - Go to: https://aistudio.google.com/app/apikeys
   - Create a new API key
   - Free tier available

**Update .env files:**

File: `backend\.env`
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

File: `.venv\env.ps1` or set in terminal:
```powershell
$env:OPENAI_API_KEY = "sk-your-actual-key-here"
```

### Step 3: Start MongoDB

Option 1: Local MongoDB
```bash
mongod
```

Option 2: Using MongoDB Atlas (Cloud)
- Update `MONGODB_URI` in backend/.env

### Step 4: Start All Services

Open 4 terminals and run in order:

**Terminal 1 - Python AI Backend (Port 8001)**
```bash
cd "e:\DRESSIFY AI NEW\Dressify Ai\Dressify Ai\backend"
python.exe ai_backend.py
```

**Terminal 2 - Node.js API Backend (Port 8000)**
```bash
cd "e:\DRESSIFY AI NEW\Dressify Ai\Dressify Ai\backend"
node server.js
```

**Terminal 3 - Frontend Server (Port 3000)**
```bash
cd "e:\DRESSIFY AI NEW\Dressify Ai"
node server.js
```

**Terminal 4 - Flask Chat API (Port 5000)** [Optional]
```bash
cd "e:\DRESSIFY AI NEW\Dressify Ai\Dressify Ai\backend"
python.exe python_chat_api.py
```

### Step 5: Access the Application

Open your browser and go to:
- **Main App:** http://localhost:3000
- **AI Hub:** http://localhost:3000/ai-hub-new.html
- **Chat:** http://localhost:3000/gemini_chatbot.html

## Available Endpoints

### Frontend (Port 3000)
- `GET /` - Home page
- `GET /ai-hub-new.html` - AI Hub (upload images, get recommendations)
- `GET /gemini_chatbot.html` - Chat interface

### Node.js Backend (Port 8000)
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/ai-hub/recommendations` - Get recommendations
- `POST /api/upload/upload` - Upload fashion images
- `GET /api/ai-hub/image/metadata` - Get image metadata

### Python Backend (Port 8001)
- `GET /health` - Health check
- `POST /gemini-chat` - Send message to AI
- `POST /recommend` - Get fashion recommendations

## API Key Recommendations

### **Best Option: OpenAI GPT-4o** ⭐⭐⭐
**Cost:** ~$0.01-0.03 per request (for short responses)
**Pros:**
- Best quality responses
- Excellent for fashion advice
- Reliable and fast
- Great token efficiency

**Sign up:** https://platform.openai.com

### **Alternative: Google Gemini** ⭐⭐
**Cost:** Free tier available (limited), $20/month for pro
**Pros:**
- Free option available
- Good quality
- Large context window

**Sign up:** https://aistudio.google.com

### **Not Recommended: Groq**
- Limited for conversational AI
- Better for code/technical tasks

## Troubleshooting

### Issue: "404 Not Found" on AI Hub
**Solution:** Make sure all 3 servers are running (Node 8000, Python 8001, Frontend 3000)

### Issue: "API Key not set"
**Solution:** 
1. Get API key from OpenAI (https://platform.openai.com/api-keys)
2. Update backend/.env with your key
3. Restart the Python backend

### Issue: MongoDB Connection Failed
**Solution:**
1. Make sure MongoDB is running: `mongod`
2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Issue: "Cannot find module"
**Solution:**
```bash
npm install  # For Node.js dependencies
pip install -r requirements.txt  # For Python dependencies
```

## Monitoring

Check if services are running:
```bash
# Check port 3000 (Frontend)
netstat -ano | findstr :3000

# Check port 8000 (Node backend)
netstat -ano | findstr :8000

# Check port 8001 (Python backend)
netstat -ano | findstr :8001

# Check port 27017 (MongoDB)
netstat -ano | findstr :27017
```

## Next Steps

1. ✅ Install all dependencies
2. ✅ Get OpenAI API key
3. ✅ Update .env files
4. ✅ Start MongoDB
5. ✅ Start all 3 servers
6. ✅ Open http://localhost:3000 in browser
7. ✅ Test AI recommendations feature
8. ✅ Test chat functionality

---

**Created:** February 2, 2026
**Status:** Ready for deployment
