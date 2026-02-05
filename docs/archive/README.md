# 🎨 Dressify AI - Fashion Made Smart

A modern fashion AI platform with avatar customization, AI recommendations, and smart styling.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Start backend server
npm start
```

The backend will run on `http://127.0.0.1:8000`

## 📁 Project Structure

```
Dressify Ai/
├── backend/              # Node.js Express server
├── assets/              # Images and static files
├── index.html          # Home page
├── ai-hub.html         # AI recommendations
├── avatar-customizer.html  # Avatar creator
├── gemini_chatbot.html # Fashion chat
├── login.html          # Login page
├── signup.html         # Signup page
└── README.md           # This file
```

## 🌐 Pages

- **Home** - Welcome page with features
- **AI Hub** - Image upload & fashion recommendations
- **Avatar** - Create and customize fashion avatars
- **Chat** - AI chatbot for fashion advice
- **Login/Signup** - User authentication

## 🎨 Features

✅ AI-powered fashion recommendations
✅ Avatar customization with 4 clothing categories
✅ Image analysis and suggestions
✅ Fashion chat with AI
✅ User authentication
✅ Responsive design
✅ Unified navigation theme

## 🔗 API Endpoints

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/avatar` - Create avatar
- `POST /api/avatar/:userId/preset` - Apply preset style
- `POST /api/upload/analyze` - Analyze uploaded images
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/recommendations` - Get style recommendations

## 🎯 Default Login

For testing, use the backend's in-memory storage.

## 📝 Notes

- Images are stored in `/backend/uploads/`
- All avatars and outfits use in-memory storage (ready for MongoDB integration)
- CORS enabled for local development

## 🚀 Deployment

For production:
1. Add MongoDB connection
2. Use environment variables for secrets
3. Deploy backend to cloud (Heroku, AWS, etc.)
4. Deploy frontend to CDN (Vercel, Netlify, etc.)

---

**Made with ❤️ using Node.js, Express, and AI**
