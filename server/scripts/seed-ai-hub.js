const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Models
const Recommendation = require('./models/Recommendation');
const AIChat = require('./models/AIChat');
const AIHubImage = require('./models/AIHubImage');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dressify';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');
  
  try {
    // Clear existing test data
    console.log('\n📋 Clearing existing test data...');
    await Recommendation.deleteMany({ userId: 'test-user-123' });
    await AIChat.deleteMany({ userId: 'test-user-123' });
    await AIHubImage.deleteMany({ userId: 'test-user-123' });
    console.log('✅ Cleared old test data');

    // Seed Recommendations
    console.log('\n📝 Seeding recommendations...');
    const recommendations = await Recommendation.insertMany([
      {
        userId: 'test-user-123',
        preferences: 'Casual, comfortable, eco-friendly',
        budget: '$50-$100',
        style: 'Casual',
        occasion: 'Everyday Wear',
        recommendations: [
          {
            name: 'Organic Cotton T-Shirt',
            category: 'Tops',
            description: 'Comfortable 100% organic cotton t-shirt',
            color: 'Light Blue',
            price: '$35',
            why: 'Perfect for casual everyday wear with eco-friendly materials'
          },
          {
            name: 'Denim Jeans',
            category: 'Bottoms',
            description: 'Classic blue denim jeans',
            color: 'Dark Blue',
            price: '$65',
            why: 'Versatile and comfortable for casual styling'
          },
          {
            name: 'White Canvas Sneakers',
            category: 'Shoes',
            description: 'Minimalist white canvas shoes',
            color: 'White',
            price: '$55',
            why: 'Goes well with casual outfits and eco-conscious brands available'
          }
        ],
        status: 'completed',
        rating: 5,
        feedback: 'Excellent recommendations!'
      },
      {
        userId: 'test-user-123',
        preferences: 'Formal, professional, business',
        budget: '$100-$200',
        style: 'Business',
        occasion: 'Work',
        recommendations: [
          {
            name: 'Navy Blazer',
            category: 'Jackets',
            description: 'Professional navy blazer',
            color: 'Navy Blue',
            price: '$120',
            why: 'Essential business wear piece'
          },
          {
            name: 'White Dress Shirt',
            category: 'Tops',
            description: 'Crisp white dress shirt',
            color: 'White',
            price: '$60',
            why: 'Classic business essential'
          }
        ],
        status: 'completed',
        rating: 4,
        feedback: 'Good suggestions for work'
      }
    ]);
    console.log(`✅ Created ${recommendations.length} recommendations`);

    // Seed Chat History
    console.log('\n💬 Seeding chat conversations...');
    const chats = await AIChat.insertMany([
      {
        userId: 'test-user-123',
        conversationId: 'conv-001',
        topic: 'Fashion Advice',
        messages: [
          {
            role: 'user',
            message: 'What colors go well with my blue eyes?'
          },
          {
            role: 'assistant',
            message: 'Blue eyes are complimented by warm colors like orange, coral, and gold. You should also try jewel tones like emerald and sapphire for beautiful contrast.'
          },
          {
            role: 'user',
            message: 'What about for casual wear?'
          },
          {
            role: 'assistant',
            message: 'For casual wear, try blue jeans with coral or peach tops, or white tees with gold accessories. Warm beiges and tans also work great!'
          }
        ],
        status: 'active'
      },
      {
        userId: 'test-user-123',
        conversationId: 'conv-002',
        topic: 'Styling Tips',
        messages: [
          {
            role: 'user',
            message: 'How do I style a minimalist wardrobe?'
          },
          {
            role: 'assistant',
            message: 'Minimalist fashion focuses on basics: white tees, neutral colors, and quality pieces. Stick to a color palette of blacks, whites, and grays with one accent color.'
          }
        ],
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${chats.length} conversations`);

    // Seed Images
    console.log('\n🖼️  Seeding image records...');
    const images = await AIHubImage.insertMany([
      {
        userId: 'test-user-123',
        filename: 'outfit-001.jpg',
        originalName: 'my-casual-outfit.jpg',
        filepath: '/uploads/outfit-001.jpg',
        filesize: 245000,
        mimetype: 'image/jpeg',
        analysis: {
          colors: ['blue', 'white', 'gray'],
          clothingType: 'casual wear',
          style: 'minimalist',
          occasion: 'everyday wear',
          description: 'Light blue t-shirt with white sneakers'
        },
        tags: ['casual', 'summer', 'favorite'],
        status: 'analyzed'
      },
      {
        userId: 'test-user-123',
        filename: 'outfit-002.jpg',
        originalName: 'my-formal-outfit.jpg',
        filepath: '/uploads/outfit-002.jpg',
        filesize: 312000,
        mimetype: 'image/jpeg',
        analysis: {
          colors: ['navy', 'white', 'black'],
          clothingType: 'formal wear',
          style: 'business',
          occasion: 'work',
          description: 'Navy blazer with white shirt and black pants'
        },
        tags: ['formal', 'work', 'professional'],
        status: 'analyzed'
      }
    ]);
    console.log(`✅ Created ${images.length} image records`);

    // Display summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST DATA SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Recommendations: ${recommendations.length}`);
    console.log(`✅ Chat Conversations: ${chats.length}`);
    console.log(`✅ Image Records: ${images.length}`);
    console.log('\n📋 Test User ID: test-user-123');
    console.log('\n🧪 To test the data:');
    console.log('   1. Open MongoDB shell: mongo');
    console.log('   2. Select database: use dressify');
    console.log('   3. View data:');
    console.log('      db.recommendations.find({ userId: "test-user-123" }).pretty()');
    console.log('      db.ai_chats.find({ userId: "test-user-123" }).pretty()');
    console.log('      db.ai_hub_images.find({ userId: "test-user-123" }).pretty()');
    console.log('\n4. Start backend server: node server.js');
    console.log('\n5. Test API endpoints with user ID: test-user-123');
    console.log('   GET http://127.0.0.1:8000/api/ai-hub/recommendations/test-user-123');
    console.log('   GET http://127.0.0.1:8000/api/ai-hub/chat-history/test-user-123');
    console.log('   GET http://127.0.0.1:8000/api/ai-hub/images/test-user-123');
    console.log('   GET http://127.0.0.1:8000/api/ai-hub/stats/test-user-123');
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
