🧪 ADMIN ORDERS MANAGEMENT - TESTING GUIDE

═══════════════════════════════════════════════════════════════

🚀 STEP 1: START EVERYTHING

Terminal 1 - Start MongoDB:
  mongod

Terminal 2 - Start Backend:
  cd backend
  npm install  (if first time)
  node server.js
  ✓ Should show: "🚀 Dressify Backend Server is running on http://127.0.0.1:8000"

Terminal 3 - Open Browser:
  Open: http://localhost:3000
  Or open index.html in browser

═══════════════════════════════════════════════════════════════

🚀 STEP 2: CREATE ADMIN ACCOUNT (First Time Only)

Option A - Use MongoDB:
  mongosh
  use dressify_db
  db.users.insertOne({
    fullname: "Admin User",
    email: "admin@dressify.com",
    password: "hashed_password",
    isAdmin: true
  })

Option B - Use Signup:
  1. Go to signup.html
  2. Create account with email: admin@dressify.com
  3. Then in MongoDB, set isAdmin: true
     db.users.updateOne({email: "admin@dressify.com"}, {$set: {isAdmin: true}})

═══════════════════════════════════════════════════════════════

🚀 STEP 3: LOGIN AS ADMIN

1. Go to login.html
2. Enter admin email: admin@dressify.com
3. Enter password
4. Click "Login"
5. Should redirect to index.html (logged in)

═══════════════════════════════════════════════════════════════

🚀 STEP 4: CREATE TEST ORDERS

As Admin User:
1. Go to products.html
2. Add 2-3 products to cart
3. Go to cart.html
4. Fill in shipping address
5. Select payment method
6. Click "Place Order"
7. Complete payment on payment.html
8. Repeat 3-4 times to create multiple orders

═══════════════════════════════════════════════════════════════

🚀 STEP 5: ACCESS ADMIN PANEL

1. Go to admin.html
   - Should show admin dashboard
   - Shows current admin info
   - Shows recent orders

2. Click "📦 Manage Orders"
   - Opens admin-orders.html
   - Should see all orders created

═══════════════════════════════════════════════════════════════

🚀 STEP 6: TEST ORDER MANAGEMENT

A. VIEW STATISTICS:
   □ Total Orders shows correct count
   □ Pending Payment shows pending orders
   □ Paid Orders shows paid orders
   □ Total Revenue shows sum of amounts

B. SEARCH & FILTER:
   □ Search by Order ID - enter partial ID, see filtered results
   □ Filter by Status - select "Confirmed", see only confirmed
   □ Filter by Payment - select "Pending", see unpaid orders
   □ Filter by Method - select "Card", see card payments

C. VIEW ORDER DETAILS:
   □ Click "View" on any order
   □ Modal opens showing:
     - Order ID
     - Customer name and email
     - Shipping address
     - Items list with prices
     - Total amount
     - Payment method
     - Payment status
     - Order status

D. UPDATE ORDER STATUS:
   □ Click "View" on order with status "Processing"
   □ Change status dropdown to "Shipped"
   □ Click "Update Status"
   □ Modal closes
   □ Go back to list
   □ Order status changed to "Shipped"

E. MARK AS PAID:
   □ Click "View" on order with "Pending" payment
   □ Click "Mark as Paid" button
   □ Confirm in dialog
   □ Payment status changes to "Paid"
   □ Close modal
   □ List updates showing "PAID"

═══════════════════════════════════════════════════════════════

🔍 VERIFICATION CHECKLIST:

Backend API Endpoints:

□ Get all orders (admin)
  curl http://127.0.0.1:8000/api/orders \
    -H "Authorization: Bearer {token}"

□ Get specific order
  curl http://127.0.0.1:8000/api/orders/{orderId} \
    -H "Authorization: Bearer {token}"

□ Mark order paid
  curl -X POST http://127.0.0.1:8000/api/orders/{orderId}/pay \
    -H "Authorization: Bearer {token}"

□ Update order status
  curl -X PUT http://127.0.0.1:8000/api/orders/{orderId} \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d '{"status":"shipped"}'

MongoDB Verification:

□ Check orders collection:
  mongosh
  use dressify_db
  db.orders.find().pretty()

□ Count total orders:
  db.orders.countDocuments()

□ Find admin's orders:
  db.orders.find({user: ObjectId("...")})

□ Check order status field:
  db.orders.findOne({_id: ObjectId("...")})

═══════════════════════════════════════════════════════════════

🐛 TROUBLESHOOTING:

Issue: "Only admin can access"
Solution: 
  - Verify user.isAdmin is true in database
  - Check token is valid
  - Login again and retry

Issue: No orders showing
Solution:
  - Create some test orders first
  - Check MongoDB is running
  - Check backend console for errors
  - Verify orders exist: db.orders.count()

Issue: Cannot update status
Solution:
  - Ensure logged in as admin
  - Check backend console for errors
  - Verify PUT endpoint is working
  - Check network tab in browser dev tools

Issue: Filter not working
Solution:
  - Clear filters and try again
  - Refresh page
  - Check browser console for errors
  - Check data exists

Issue: Modal not opening
Solution:
  - Check browser console for JavaScript errors
  - Try clicking View button again
  - Refresh page

═══════════════════════════════════════════════════════════════

✨ EXPECTED BEHAVIOR:

When Everything Works:

1. Admin Dashboard
   ✓ Shows admin name and email
   ✓ Quick links visible
   ✓ Recent orders loaded

2. Orders Management
   ✓ All orders displayed
   ✓ Statistics calculated correctly
   ✓ Filters work in real-time
   ✓ Search finds orders
   ✓ Pagination works
   ✓ Modal opens on View click
   ✓ Status updates work
   ✓ Mark paid works
   ✓ List refreshes automatically

3. Permissions
   ✓ Non-admins cannot access admin pages
   ✓ Users see only their orders
   ✓ Admins see all orders
   ✓ Only admins can update status

═══════════════════════════════════════════════════════════════

🔐 SECURITY TESTS:

Try to bypass admin:
✗ Access admin-orders.html directly without login
  → Should redirect to login.html

✗ Modify token to claim admin
  → Backend should verify and reject

✗ Non-admin accessing admin page
  → Should redirect to index.html

✗ User trying to update someone else's order
  → Backend should return 403 Forbidden

═══════════════════════════════════════════════════════════════

📊 SAMPLE TEST DATA:

Create these orders to test all features:

Order 1:
  Status: Processing
  Payment: Pending
  Method: Card
  Amount: ₹2500

Order 2:
  Status: Confirmed
  Payment: Paid
  Method: UPI
  Amount: ₹1500

Order 3:
  Status: Shipped
  Payment: Paid
  Method: Wallet
  Amount: ₹3200

Order 4:
  Status: Processing
  Payment: Pending
  Method: COD
  Amount: ₹4000

═══════════════════════════════════════════════════════════════

✅ SIGN-OFF CHECKLIST:

Frontend Tests:
  □ Admin login works
  □ Admin dashboard loads
  □ Orders management page loads
  □ All statistics display correctly
  □ Filters work
  □ Search works
  □ View details modal opens
  □ Update status works
  □ Mark paid works
  □ Pagination works
  □ Responsive on mobile

Backend Tests:
  □ GET /api/orders returns all orders for admin
  □ GET /api/orders returns user's orders for user
  □ POST /api/orders/{id}/pay works
  □ PUT /api/orders/{id} updates status
  □ Admin permissions enforced
  □ User cannot see other's orders

Database Tests:
  □ Orders created in MongoDB
  □ Status updates reflected in DB
  □ Payment status updates reflected
  □ All fields saved correctly

═══════════════════════════════════════════════════════════════

🎉 SYSTEM READY FOR PRODUCTION

When all checks pass, system is ready for:
  ✅ Live use
  ✅ Customer orders
  ✅ Admin management
  ✅ Payment processing
  ✅ Order tracking

═══════════════════════════════════════════════════════════════
