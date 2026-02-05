const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dressify';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️  Running without database - data will not persist');
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
const authRoutes = require('./api/auth');
const fashionRoutes = require('./api/fashion');
const uploadRoutes = require('./api/upload');
const aiRoutes = require('./api/ai');
const aiHubRoutes = require('./api/ai-hub');
const avatarRoutes = require('./api/avatar');
const productsRoutes = require('./api/products');
const ordersRoutes = require('./api/orders');
const userProfileRoutes = require('./api/user-profile');

app.use('/api/auth', authRoutes);
app.use('/api/fashion', fashionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai-hub', aiHubRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/user', userProfileRoutes);

// Serve static files (HTML, CSS, JS) from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', message: 'Dressify AI Backend is active' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dressify Backend Server is running on http://127.0.0.1:${PORT}`);
  console.log(`📡 CORS enabled for frontend development`);
});
