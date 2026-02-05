# E-Commerce Feature Guide

## Overview
Dressify AI now includes a complete e-commerce system with a product catalog, shopping cart, and admin order management.

## 🛍️ Product Catalog

### Access Products Page
- **URL**: `http://localhost:3000/products.html`
- **Navigation**: Click "Products" in navbar from any page

### Features
- **Catalog Display**: Shows 15 sample clothing products (T-shirts, jeans, dresses, shoes, jackets, sweaters, etc.)
- **Product Info**: 
  - Product name and description
  - Price in Indian Rupees (₹)
  - High-quality placeholder images
  - Stock information
- **Search**: Filter products by name or keyword
- **Add to Cart**: Click "Add to Cart" button on any product
  - Items stored in localStorage
  - Persists across page reloads

### Sample Products
1. Classic Cotton T-Shirt - ₹499
2. Blue Denim Jeans - ₹1,499
3. Formal White Shirt - ₹1,299
4. Black Leather Jacket - ₹4,999
5. Summer Floral Dress - ₹1,799
6. Sports Running Shoes - ₹2,999
7. Chic Black Blazer - ₹3,499
8. Comfortable Jogger Pants - ₹899
9. Striped Polo Shirt - ₹899
10. Cozy Winter Sweater - ₹1,599
11. Casual Canvas Sneakers - ₹1,299
12. Elegant Evening Gown - ₹5,999
13. Casual Shorts - ₹649
14. Designer Handbag - ₹3,999
15. Cotton Socks Set - ₹399

---

## 🛒 Shopping Cart

### How It Works
- Products are added to cart using browser's localStorage
- Cart persists even after closing browser
- Each item tracks: quantity, price, product ID, image

### Cart Storage Format (localStorage)
```javascript
// localStorage.cart
[
  {
    productId: 1,
    name: "Classic Cotton T-Shirt",
    price: 499,
    quantity: 2,
    image: "/uploads/image-xxx.jpg"
  },
  ...
]
```

---

## 📦 Admin Order Dashboard

### Access Admin Page
- **URL**: `http://localhost:3000/admin.html`
- **Required**: Admin authentication token
- **Admin Credentials**: 
  - Email: `shrvankad@gmail.com`
  - Password: `Shrvan@45`

### Features
- **View All Orders**: Lists all customer orders (admin-only)
- **Order Details**:
  - Order ID and creation date
  - Customer name and email
  - Items with quantity, price, and product images
  - Total amount
  - Payment status (pending/paid)
  - Payment method used
- **Mark as Paid**: Admin can mark pending orders as paid
- **Images Display**: Product images from each order item

### Example Order Display
```
Order: 123abc456def... | Jan 19, 2025 10:30 AM
User: John Doe <john@example.com>

Items:
[Image] Classic Cotton T-Shirt (Qty: 2 × ₹499)
[Image] Blue Denim Jeans (Qty: 1 × ₹1,499)

Total: ₹2,497 | Payment: pending | Method: manual
[Mark Paid Button]
```

---

## 🔌 Backend API Endpoints

### Products API
```
GET  /api/products              # List all products with filters
GET  /api/products/suggest      # Get product suggestions
GET  /api/products/:id          # Get single product
POST /api/products              # Create product (admin only)
PUT  /api/products/:id          # Update product (admin only)
DELETE /api/products/:id        # Delete product (admin only)
```

### Orders API
```
POST /api/orders/create         # Create new order (authenticated)
POST /api/orders/:id/pay        # Mark order as paid
GET  /api/orders                # Get orders (admin: all, user: own)
GET  /api/orders/:id            # Get order details
```

### Data Models

#### Product Schema
```javascript
{
  name: String,              // Product name
  description: String,       // Product description
  price: Number,            // Price in rupees
  category: String,         // "Tops", "Bottoms", "Dresses", "Shoes", "Outerwear", "Accessories"
  tags: [String],           // Search tags
  images: [String],         // Array of image URLs
  stock: Number,            // Available quantity
  metadata: Object,         // Custom metadata
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Schema
```javascript
{
  user: ObjectId,           // Reference to User
  items: [
    {
      productId: ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: Number,            // Order total
  shippingAddress: Object,  // Delivery address
  paymentMethod: String,    // "manual", "stripe", "paypal", etc.
  paymentStatus: String,    // "pending", "paid", "failed"
  status: String,           // "processing", "confirmed", "shipped", "delivered"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 How to Run Locally

### 1. Start Backend Server
```powershell
cd backend
npm install
node server.js
# Server runs on http://127.0.0.1:8000
```

### 2. Start Frontend HTTP Server
```powershell
cd Dressify\ Ai
python -m http.server 3000
# Frontend available at http://localhost:3000
```

### 3. Access Pages
- **Products**: http://localhost:3000/products.html
- **Admin**: http://localhost:3000/admin.html (with auth)
- **Home**: http://localhost:3000/index.html

---

## 💾 Database Setup (Optional)

To enable MongoDB persistence:

1. **Install MongoDB**
   - Windows: Download from mongodb.com
   - Or use MongoDB Atlas (cloud)

2. **Set Environment Variable**
   ```powershell
   $env:MONGODB_URI="mongodb://localhost:27017/dressify"
   ```

3. **Seed Products**
   ```powershell
   cd backend
   node seed-products.js
   ```

4. **Seed Admin User**
   ```powershell
   node seed-admin.js
   ```

---

## 📋 Features Implemented

✅ Product Catalog (15 sample items)
✅ Search & Filter
✅ Add to Cart (localStorage)
✅ Admin Order Dashboard
✅ Order Details with Images
✅ Mark Order as Paid
✅ Product API CRUD
✅ Order Creation API
✅ Mock data fallback

---

## 🔜 Features Not Yet Implemented

⏳ Cart Checkout Flow
⏳ Payment Integration (Stripe/PayPal)
⏳ Shipping & Tracking
⏳ User Order History
⏳ Product Reviews & Ratings
⏳ Wishlist
⏳ Inventory Management

---

## 📝 Notes

- **Mock Products**: 15 sample clothing items with realistic prices and descriptions
- **Mock Images**: Using placeholder.com for temporary image display
- **localStorage**: Used for cart since MongoDB may not be installed
- **Admin Only**: Certain endpoints require admin authentication
- **Payment**: Currently using "manual" flag; ready for Stripe/PayPal integration

---

## 🆘 Troubleshooting

### Products page shows "No products found"
- Check backend is running: `http://127.0.0.1:8000/health`
- Check HTTP server is running on port 3000
- Browser console may show CORS errors (expected if backend auth fails)

### Cart not persisting
- Check browser localStorage: open DevTools → Application → localStorage
- Clear cache and try again

### Admin page shows "Not authorized"
- Ensure you're logged in with admin account
- Check token in localStorage

---

For questions or issues, refer to the main README.md file.
