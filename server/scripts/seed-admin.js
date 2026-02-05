const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dressify';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'shrvankad@gmail.com' });
    
    if (adminExists) {
      console.log('⚠️  Admin user already exists!');
      await mongoose.connection.close();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Shrvan@45', 10);

    // Create admin user
    const adminUser = new User({
      fullname: 'Admin Shrvan',
      email: 'shrvankad@gmail.com',
      password: hashedPassword,
      isAdmin: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: shrvankad@gmail.com');
    console.log('Password: Shrvan@45');
    
    // Display all users
    const allUsers = await User.find().select('-password');
    console.log('\n📋 All users in database:');
    console.table(allUsers);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.connection.close();
  }
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
