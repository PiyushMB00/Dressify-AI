const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dressify';

async function showAllEmails() {
  try {
    console.log('📡 Connecting to MongoDB...\n');
    
    // Step 1: Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Step 1: Connected to MongoDB successfully\n');

    // Step 2: Define User Model
    const userSchema = new mongoose.Schema({
      fullname: String,
      email: String,
      isAdmin: Boolean,
      createdAt: Date
    });
    const User = mongoose.model('User', userSchema);
    console.log('✅ Step 2: User model defined\n');

    // Step 3: Query all users from database
    console.log('✅ Step 3: Querying all users from database...\n');
    const users = await User.find();
    
    if (users.length === 0) {
      console.log('⚠️  No users found in database\n');
      process.exit(0);
    }

    // Step 4: Display results
    console.log(`✅ Step 4: Found ${users.length} user(s)\n`);
    console.log('📧 EMAIL LIST FROM DATABASE:');
    console.log('═'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.fullname}`);
      console.log(`   Admin: ${user.isAdmin ? 'Yes ✓' : 'No'}`);
      console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n✨ Total Emails: ${users.length}\n`);

    // Step 5: Close connection
    await mongoose.connection.close();
    console.log('✅ Step 5: Database connection closed');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

showAllEmails();
