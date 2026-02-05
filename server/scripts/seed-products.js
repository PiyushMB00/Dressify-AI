const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dressify';

const products = [
  {
    name: "Classic Cotton T-Shirt",
    description: "Comfortable everyday t-shirt made from 100% organic cotton. Perfect for casual wear.",
    price: 499,
    category: "Tops",
    tags: ["casual", "cotton", "comfortable"],
    images: ["https://via.placeholder.com/500x500?text=Cotton+T-Shirt"],
    stock: 50
  },
  {
    name: "Blue Denim Jeans",
    description: "Classic blue jeans with perfect fit. Durable and stylish for everyday wear.",
    price: 1499,
    category: "Bottoms",
    tags: ["jeans", "denim", "casual"],
    images: ["https://via.placeholder.com/500x500?text=Denim+Jeans"],
    stock: 35
  },
  {
    name: "Formal White Shirt",
    description: "Elegant white dress shirt suitable for office and formal occasions. Premium cotton blend.",
    price: 1299,
    category: "Tops",
    tags: ["formal", "shirt", "work"],
    images: ["https://via.placeholder.com/500x500?text=Formal+Shirt"],
    stock: 28
  },
  {
    name: "Black Leather Jacket",
    description: "Classic black leather jacket with zipper details. Timeless style for any outfit.",
    price: 4999,
    category: "Outerwear",
    tags: ["leather", "jacket", "black"],
    images: ["https://via.placeholder.com/500x500?text=Leather+Jacket"],
    stock: 15
  },
  {
    name: "Summer Floral Dress",
    description: "Lightweight floral print dress perfect for summer. Comfortable and breathable fabric.",
    price: 1799,
    category: "Dresses",
    tags: ["summer", "floral", "dress"],
    images: ["https://via.placeholder.com/500x500?text=Floral+Dress"],
    stock: 22
  },
  {
    name: "Sports Running Shoes",
    description: "Professional running shoes with cushioned sole and breathable mesh. Great for jogging and gym.",
    price: 2999,
    category: "Shoes",
    tags: ["sports", "running", "shoes"],
    images: ["https://via.placeholder.com/500x500?text=Running+Shoes"],
    stock: 40
  },
  {
    name: "Chic Black Blazer",
    description: "Sophisticated black blazer perfect for professional settings. Tailored fit with quality stitching.",
    price: 3499,
    category: "Outerwear",
    tags: ["blazer", "formal", "black"],
    images: ["https://via.placeholder.com/500x500?text=Black+Blazer"],
    stock: 18
  },
  {
    name: "Comfortable Jogger Pants",
    description: "Casual jogger pants with elastic waist and cuffed ankles. Perfect for relaxing at home.",
    price: 899,
    category: "Bottoms",
    tags: ["casual", "joggers", "comfortable"],
    images: ["https://via.placeholder.com/500x500?text=Jogger+Pants"],
    stock: 45
  },
  {
    name: "Striped Polo Shirt",
    description: "Classic striped polo shirt with collar. Versatile piece for casual and semi-formal occasions.",
    price: 899,
    category: "Tops",
    tags: ["polo", "striped", "casual"],
    images: ["https://via.placeholder.com/500x500?text=Polo+Shirt"],
    stock: 32
  },
  {
    name: "Cozy Winter Sweater",
    description: "Warm knit sweater perfect for cold weather. Available in multiple colors.",
    price: 1599,
    category: "Outerwear",
    tags: ["sweater", "winter", "warm"],
    images: ["https://via.placeholder.com/500x500?text=Winter+Sweater"],
    stock: 27
  },
  {
    name: "Casual Canvas Sneakers",
    description: "Lightweight canvas sneakers in classic design. Perfect for everyday casual wear.",
    price: 1299,
    category: "Shoes",
    tags: ["sneakers", "canvas", "casual"],
    images: ["https://via.placeholder.com/500x500?text=Canvas+Sneakers"],
    stock: 55
  },
  {
    name: "Elegant Evening Gown",
    description: "Stunning evening gown with elegant draping. Perfect for special occasions and parties.",
    price: 5999,
    category: "Dresses",
    tags: ["formal", "gown", "elegant"],
    images: ["https://via.placeholder.com/500x500?text=Evening+Gown"],
    stock: 10
  },
  {
    name: "Casual Shorts",
    description: "Comfortable shorts perfect for warm weather. Available in various colors and patterns.",
    price: 649,
    category: "Bottoms",
    tags: ["shorts", "casual", "summer"],
    images: ["https://via.placeholder.com/500x500?text=Casual+Shorts"],
    stock: 48
  },
  {
    name: "Designer Handbag",
    description: "Premium leather handbag with spacious compartments. Stylish and practical for everyday use.",
    price: 3999,
    category: "Accessories",
    tags: ["handbag", "leather", "fashion"],
    images: ["https://via.placeholder.com/500x500?text=Handbag"],
    stock: 12
  },
  {
    name: "Cotton Socks Set",
    description: "Comfortable cotton socks in a pack of 6. Perfect for daily wear.",
    price: 399,
    category: "Accessories",
    tags: ["socks", "cotton", "comfort"],
    images: ["https://via.placeholder.com/500x500?text=Socks+Set"],
    stock: 100
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${result.length} products`);

    // Display summary
    console.log('\n📦 Seeded Products:');
    result.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ₹${p.price} (Stock: ${p.stock})`);
    });

    console.log('\n✨ Seeding complete! Products are now available in the catalog.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();
