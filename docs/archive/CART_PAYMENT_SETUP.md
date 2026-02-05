# Shopping Cart & Payment System Setup ✅

## What's Been Added

### 1. **Shopping Cart Page** (`cart.html`)
- View all items in cart
- Adjust quantities (+ / -)
- Remove items from cart
- Real-time total calculation with tax and shipping
- Shipping address form
- Payment method selection (Card, UPI, Wallet, COD)

### 2. **Payment Page** (`payment.html`)
- Display order details
- Multiple payment methods:
  - 💳 Credit/Debit Card
  - 📱 UPI Payment
  - 💰 Digital Wallet (Paytm, Google Pay, PhonePe, Amazon Pay)
  - 🚚 Cash on Delivery
- Secure payment processing
- Order confirmation

### 3. **Enhanced Product Page**
- Better "Add to Cart" notifications with link to cart
- Toast notifications instead of alerts
- "🛒 View Cart" button with cart icon

### 4. **Backend Integration**
- Uses existing `/api/orders/create` endpoint
- Uses existing `/api/orders/:id/pay` endpoint
- Stored in MongoDB with all details
- Order tracking available

## How It Works

### User Flow:
1. **Products Page** (`products.html`)
   - Browse products with images from MongoDB
   - Click "Add to Cart" button
   - See toast notification with link to cart

2. **Shopping Cart** (`cart.html`)
   - View all added items
   - Adjust quantities
   - Fill shipping address
   - Select payment method
   - Click "Place Order"

3. **Payment Processing** (`payment.html`)
   - Review order details
   - Enter payment information
   - Confirm payment
   - Redirected to home page on success

## Database Information

### Collections Used:
- `products` - Product information
- `product_images` - Product images (base64 encoded)
- `orders` - Order records with:
  - Items list
  - Shipping address
  - Payment method
  - Payment status (pending/paid)
  - Order status

### Sample Order Document:
```json
{
  "_id": ObjectId,
  "user": ObjectId,
  "items": [
    {
      "productId": ObjectId,
      "name": "Blue Denim Jeans",
      "price": 1499,
      "quantity": 2,
      "image": "assets/clothing/denim_jeans.jpg"
    }
  ],
  "total": 3348,
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400001"
  },
  "paymentMethod": "card",
  "paymentStatus": "paid",
  "status": "confirmed",
  "createdAt": "2026-01-19T...",
  "updatedAt": "2026-01-19T..."
}
```

## API Endpoints Used

### Create Order
```
POST /api/orders/create
Headers: Authorization: Bearer {token}
Body: {
  items: [{productId, quantity}],
  shippingAddress: {fullName, email, phone, address, city, state, zip},
  paymentMethod: "card|upi|wallet|cod"
}
Response: {message, order}
```

### Process Payment
```
POST /api/orders/{orderId}/pay
Headers: Authorization: Bearer {token}
Body: {
  method: "card|upi|wallet|cod",
  [card details if card method],
  [upi details if upi method],
  [wallet details if wallet method]
}
Response: {message, order}
```

### Get Order Details
```
GET /api/orders/{orderId}
Headers: Authorization: Bearer {token}
Response: {order}
```

## Testing the System

1. **Start Backend**
   ```
   cd backend
   node server.js
   ```

2. **Start MongoDB**
   ```
   mongod
   ```

3. **Test Flow**
   - Open `products.html`
   - Add items to cart
   - Click "View Cart"
   - Fill in details and select payment method
   - Click "Place Order"
   - Complete payment on `payment.html`

4. **Verify in MongoDB**
   ```
   db.orders.find()
   db.product_images.find()
   ```

## Features Summary

✅ Persistent cart (localStorage)
✅ Real-time price calculations
✅ Multiple payment methods
✅ Complete shipping form
✅ MongoDB order storage
✅ Toast notifications
✅ Responsive design
✅ Secure payment processing
✅ Order confirmation
✅ User authentication support

## Files Modified/Created

### Created:
- `cart.html` - Shopping cart page
- `payment.html` - Payment processing page

### Modified:
- `products.html` - Added View Cart button
- `products.js` - Improved Add to Cart with notifications

### Backend (No changes needed - already compatible):
- `backend/routes/orders.js` - Already has create and pay endpoints
- `backend/models/Order.js` - Already supports shipping address
