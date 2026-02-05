(function(){
  const container = document.getElementById('products');
  const qInput = document.getElementById('q');
  const searchBtn = document.getElementById('searchBtn');
  const uploadForm = document.getElementById('uploadForm');
  const imageFile = document.getElementById('imageFile');
  const uploadStatus = document.getElementById('uploadStatus');

  const MOCK_PRODUCTS = [
    { _id: 1, name: "Classic Cotton T-Shirt", description: "Comfortable everyday t-shirt made from 100% organic cotton", price: 499, images: ["assets/clothing/cotton_t-shirt.jpg"] },
    { _id: 2, name: "Blue Denim Jeans", description: "Classic blue jeans with perfect fit. Durable and stylish", price: 1499, images: ["assets/clothing/denim_jeans.jpg"] },
    { _id: 3, name: "Formal White Shirt", description: "Elegant white dress shirt for office and formal occasions", price: 1299, images: ["assets/clothing/formal_shirt.jpg"] },
    { _id: 4, name: "Black Leather Jacket", description: "Classic black leather jacket with zipper details", price: 4999, images: ["assets/clothing/leather_jacket.jpg"] },
    { _id: 5, name: "Summer Floral Dress", description: "Lightweight floral print dress perfect for summer", price: 1799, images: ["assets/clothing/floral_dress.jpg"] },
    { _id: 6, name: "Sports Running Shoes", description: "Professional running shoes with cushioned sole", price: 2999, images: ["assets/clothing/running_shoes.jpg"] },
    { _id: 7, name: "Chic Black Blazer", description: "Sophisticated black blazer for professional settings", price: 3499, images: ["assets/clothing/black_blazer.jpg"] },
    { _id: 8, name: "Comfortable Jogger Pants", description: "Casual jogger pants with elastic waist", price: 899, images: ["assets/clothing/jogger_pants.jpg"] },
    { _id: 9, name: "Striped Polo Shirt", description: "Classic striped polo shirt with collar", price: 899, images: ["assets/clothing/polo_shirt.jpg"] },
    { _id: 10, name: "Cozy Winter Sweater", description: "Warm knit sweater perfect for cold weather", price: 1599, images: ["assets/clothing/winter_sweater.jpg"] },
    { _id: 11, name: "Casual Canvas Sneakers", description: "Lightweight canvas sneakers in classic design", price: 1299, images: ["assets/clothing/canvas_sneakers.jpg"] },
    { _id: 12, name: "Elegant Evening Gown", description: "Stunning evening gown with elegant draping", price: 5999, images: ["assets/clothing/evening_gown.jpg"] },
    { _id: 13, name: "Casual Shorts", description: "Comfortable shorts perfect for warm weather", price: 649, images: ["assets/clothing/casual_shorts.jpg"] },
    { _id: 14, name: "Designer Handbag", description: "Premium leather handbag with spacious compartments", price: 3999, images: ["assets/clothing/handbag.jpg"] },
    { _id: 15, name: "Cotton Socks Set", description: "Comfortable cotton socks in a pack of 6", price: 399, images: ["assets/clothing/socks_set.jpg"] }
  ];

  // Handle image upload
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!imageFile.files.length) {
      uploadStatus.innerHTML = '<span style="color:crimson">Please select an image</span>';
      return;
    }

    uploadStatus.innerHTML = 'Uploading...';

    const formData = new FormData();
    formData.append('image', imageFile.files[0]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        uploadStatus.innerHTML = `<span style="color:green">✅ Image uploaded successfully! ID: ${data.file.id}</span>`;
        imageFile.value = '';
        setTimeout(() => { uploadStatus.innerHTML = ''; }, 4000);
      } else {
        uploadStatus.innerHTML = `<span style="color:crimson">❌ Upload failed: ${data.message}</span>`;
      }
    } catch (err) {
      uploadStatus.innerHTML = `<span style="color:crimson">❌ Error: ${err.message}</span>`;
    }
  });

  async function fetchProducts(q){
    try{
      container.innerHTML = 'Loading products...';
      // Try API first; fall back to mock data
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        const res = await fetch(`${API_BASE_URL}/products?` + params.toString());
        if (res.ok) {
          const data = await res.json();
          renderProducts(data.products || []);
          return;
        }
      } catch (e) {
        // fallback to mock
      }
      // Use mock data
      let filtered = MOCK_PRODUCTS;
      if (q) filtered = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()));
      renderProducts(filtered);
    }catch(err){
      container.innerHTML = `<div style="color:crimson">Error: ${err.message}</div>`;
    }
  }

  function renderProducts(list){
    if (!list || list.length === 0){
      container.innerHTML = '<em>No products found</em>';
      return;
    }

    container.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      // Use local assets if available, otherwise try API
      let imgSrc = 'https://via.placeholder.com/300x300?text=Product';
      if (p.images && p.images.length > 0) {
        const imgPath = p.images[0];
        // Check if it's already a full URL
        if (imgPath.startsWith('http')) {
          imgSrc = imgPath;
        } else if (imgPath.startsWith('/')) {
          // API path
          imgSrc = `http://127.0.0.1:8000${imgPath}`;
        } else {
          // Local asset path
          imgSrc = imgPath;
        }
      }
      img.src = imgSrc;
      img.onerror = () => { img.src = 'https://via.placeholder.com/300x300?text=Product'; };

      const title = document.createElement('h3');
      title.textContent = p.name;

      const desc = document.createElement('div');
      desc.className = 'meta';
      desc.textContent = p.description || '';

      const price = document.createElement('div');
      price.className = 'price';
      price.textContent = `₹${p.price}`;

      const add = document.createElement('button');
      add.className = 'btn';
      add.textContent = 'Add to Cart';
      add.addEventListener('click', () => {
        addToCart(p);
      });

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(price);
      card.appendChild(add);

      container.appendChild(card);
    });
  }

  function addToCart(product){
    const raw = localStorage.getItem('cart');
    const cart = raw ? JSON.parse(raw) : [];
    const existing = cart.find(i => i.productId === product._id);
    if (existing) existing.quantity += 1; else cart.push({ productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show toast notification instead of alert
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:15px 20px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;font-weight:600;animation:slideIn 0.3s ease;';
    toast.innerHTML = `✓ Added to cart! <a href="cart.html" style="color:white;text-decoration:underline;margin-left:10px;">View Cart</a>`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }

  searchBtn.addEventListener('click', () => fetchProducts(qInput.value.trim()));
  qInput.addEventListener('keypress', (e)=>{ if (e.key === 'Enter') fetchProducts(qInput.value.trim()); });

  // initial load
  fetchProducts();
})();
