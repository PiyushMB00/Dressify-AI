const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/UserProfile');
const Recommendation = require('./models/Recommendation');
const AIChat = require('./models/AIChat');
const AIHubImage = require('./models/AIHubImage');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dressify';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recommendation.deleteMany({});
    await AIChat.deleteMany({});
    await AIHubImage.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample users
    const users = [
      {
        userId: 'user-demo-1',
        firstName: 'Sarah',
        lastName: 'Anderson',
        email: 'sarah@example.com',
        age: 28,
        gender: 'Female',
        bodyShape: 'Hourglass',
        skinTone: 'Medium',
        height: '5\'6"',
        preferences: {
          favoriteColors: ['Navy', 'Blush', 'Gold'],
          favoriteStyles: ['Minimalist', 'Business'],
          comfort: 'Comfortable',
          fabricPreferences: ['Cotton', 'Linen']
        },
        budget: {
          monthly: '$100-$200',
          perItem: '$25-$50'
        },
        fashionProfile: {
          primaryStyle: 'Minimalist',
          secondaryStyles: ['Business', 'Casual'],
          occasions: ['Work', 'Casual'],
          sustainabilityPriority: 'Important',
          shopingFrequency: 'Monthly'
        },
        wardrobe: {
          essentials: ['White Button-up', 'Navy Blazer', 'Black Jeans', 'White Sneakers'],
          itemCount: 45,
          favorites: [
            { item: 'Silk Blouse', brand: 'Everlane', color: 'White', occasions: ['Work'] },
            { item: 'Tailored Trousers', brand: 'Banana Republic', color: 'Navy', occasions: ['Work', 'Formal'] }
          ]
        },
        allergies: {
          fabricAllergies: [],
          dyeAllergies: []
        },
        isProfileComplete: true
      },
      {
        userId: 'user-demo-2',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@example.com',
        age: 32,
        gender: 'Male',
        bodyShape: 'Rectangle',
        skinTone: 'Fair',
        height: '5\'10"',
        preferences: {
          favoriteColors: ['Black', 'Gray', 'White'],
          favoriteStyles: ['Casual', 'Sporty'],
          comfort: 'Very comfortable',
          fabricPreferences: ['Cotton', 'Polyester']
        },
        budget: {
          monthly: '$50-$100',
          perItem: '$25-$50'
        },
        fashionProfile: {
          primaryStyle: 'Casual',
          secondaryStyles: ['Sporty'],
          occasions: ['Everyday wear', 'Vacation'],
          sustainabilityPriority: 'Neutral',
          shopingFrequency: 'Quarterly'
        },
        wardrobe: {
          essentials: ['T-shirts', 'Jeans', 'Sneakers', 'Hoodies'],
          itemCount: 35,
          favorites: [
            { item: 'Basic T-shirt', brand: 'Uniqlo', color: 'Black', occasions: ['Everyday wear'] },
            { item: 'Chinos', brand: 'Dockers', color: 'Khaki', occasions: ['Casual'] }
          ]
        },
        allergies: {
          fabricAllergies: [],
          dyeAllbergies: []
        },
        isProfileComplete: true
      },
      {
        userId: 'user-demo-3',
        firstName: 'Emma',
        lastName: 'Williams',
        email: 'emma@example.com',
        age: 25,
        gender: 'Female',
        bodyShape: 'Pear',
        skinTone: 'Light',
        height: '5\'4"',
        preferences: {
          favoriteColors: ['Burgundy', 'Forest Green', 'Peach'],
          favoriteStyles: ['Bohemian', 'Vintage'],
          comfort: 'Comfortable',
          fabricPreferences: ['Linen', 'Cotton', 'Silk']
        },
        budget: {
          monthly: '$200+',
          perItem: '$50-$100'
        },
        fashionProfile: {
          primaryStyle: 'Bohemian',
          secondaryStyles: ['Vintage', 'Trendy'],
          occasions: ['Date night', 'Party', 'Vacation'],
          sustainabilityPriority: 'Very Important',
          shopingFrequency: 'Monthly'
        },
        wardrobe: {
          essentials: ['Vintage Dresses', 'Boho Skirts', 'Leather Jackets', 'Boots'],
          itemCount: 60,
          favorites: [
            { item: 'Vintage Dress', brand: 'Thrifted', color: 'Burgundy', occasions: ['Date night', 'Party'] },
            { item: 'Flowy Skirt', brand: 'Free People', color: 'Peach', occasions: ['Casual', 'Vacation'] }
          ]
        },
        allergies: {
          fabricAllergies: [],
          dyeAllergies: []
        },
        isProfileComplete: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Create sample recommendations
    const recommendations = [
      {
        userId: 'user-demo-1',
        style: 'Minimalist',
        occasion: 'Work',
        budget: '$100-$200',
        preferences: 'Cotton, Professional, Navy colors',
        recommendations: [
          {
            name: 'Tailored Blazer',
            category: 'Outerwear',
            color: 'Navy',
            description: 'Perfect navy blazer for work meetings',
            why: 'Matches your minimalist style and work occasions'
          },
          {
            name: 'Cotton Blouse',
            category: 'Tops',
            color: 'White',
            description: 'Essential white cotton blouse',
            why: 'Versatile basic for your work wardrobe'
          }
        ],
        status: 'completed'
      },
      {
        userId: 'user-demo-2',
        style: 'Casual',
        occasion: 'Everyday Wear',
        budget: '$50-$100',
        preferences: 'Cotton, Comfortable, Gray colors',
        recommendations: [
          {
            name: 'Basic T-shirt',
            category: 'Tops',
            color: 'Gray',
            description: 'Classic comfortable gray t-shirt',
            why: 'Perfect for your casual everyday style'
          },
          {
            name: 'Comfortable Jeans',
            category: 'Bottoms',
            color: 'Dark Blue',
            description: 'Durable and comfortable jeans',
            why: 'Great for casual occasions'
          }
        ],
        status: 'completed'
      }
    ];

    const createdRecs = await Recommendation.insertMany(recommendations);
    console.log(`✅ Created ${createdRecs.length} sample recommendations`);

    // Create sample chats
    const chats = [
      {
        userId: 'user-demo-1',
        conversationId: 'conv-1',
        topic: 'Work Fashion Tips',
        messages: [
          {
            role: 'user',
            message: 'What colors work best for business meetings?',
            timestamp: new Date()
          },
          {
            role: 'assistant',
            message: 'Navy, charcoal gray, and black are professional colors. Pair with white or cream tops. Avoid bright colors unless in accessories.',
            timestamp: new Date()
          }
        ],
        status: 'active'
      },
      {
        userId: 'user-demo-3',
        conversationId: 'conv-2',
        topic: 'Summer Fashion Ideas',
        messages: [
          {
            role: 'user',
            message: 'How to style boho dresses for summer?',
            timestamp: new Date()
          },
          {
            role: 'assistant',
            message: 'Pair with sandals, add a denim jacket, layer with a lightweight scarf. Accessorize with natural materials like wood and leather.',
            timestamp: new Date()
          }
        ],
        status: 'active'
      }
    ];

    const createdChats = await AIChat.insertMany(chats);
    console.log(`✅ Created ${createdChats.length} sample chat conversations`);

    // Create sample images
    const images = [
      {
        userId: 'user-demo-1',
        filename: 'sample-1.jpg',
        originalName: 'work-outfit.jpg',
        filepath: '/uploads/sample-1.jpg',
        filesize: 2048000,
        mimetype: 'image/jpeg',
        analysis: {
          colors: ['Navy', 'White', 'Black'],
          clothingType: 'Business Outfit',
          style: 'Minimalist',
          occasion: 'Work',
          recommendations: 'Add a structured blazer and simple jewelry'
        },
        status: 'uploaded'
      },
      {
        userId: 'user-demo-3',
        filename: 'sample-2.jpg',
        originalName: 'summer-look.jpg',
        filepath: '/uploads/sample-2.jpg',
        filesize: 2500000,
        mimetype: 'image/jpeg',
        analysis: {
          colors: ['Burgundy', 'Gold'],
          clothingType: 'Dress',
          style: 'Bohemian',
          occasion: 'Casual',
          recommendations: 'Perfect for your bohemian style! Add layered necklaces'
        },
        status: 'uploaded'
      }
    ];

    const createdImages = await AIHubImage.insertMany(images);
    console.log(`✅ Created ${createdImages.length} sample uploaded images`);

    // Update users with references
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      savedRecommendations: [createdRecs[0]._id],
      uploadedImages: [createdImages[0]._id],
      chatHistory: [createdChats[0]._id],
      stats: {
        totalRecommendations: 1,
        totalImagesUploaded: 1,
        totalChats: 1,
        favoriteStyle: 'Minimalist',
        averageRating: 5
      }
    });

    await User.findByIdAndUpdate(createdUsers[2]._id, {
      savedRecommendations: [createdRecs[1]._id],
      uploadedImages: [createdImages[1]._id],
      chatHistory: [createdChats[1]._id],
      stats: {
        totalRecommendations: 1,
        totalImagesUploaded: 1,
        totalChats: 1,
        favoriteStyle: 'Bohemian',
        averageRating: 4
      }
    });

    console.log('✅ Updated user references');

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\nSample Users Created:');
    console.log('1. user-demo-1: Sarah Anderson (Minimalist style)');
    console.log('2. user-demo-2: Alex Johnson (Casual style)');
    console.log('3. user-demo-3: Emma Williams (Bohemian style)');
    console.log('\nYou can use these user IDs to test the application.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
