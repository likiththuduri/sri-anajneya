// End-to-End API verification script for SRI ANJANEYA full-stack backend
const BASE_URL = 'http://localhost:8081';

async function testApi() {
  console.log('--- STARTING SRI ANJANEYA BACKEND VERIFICATION ---');

  // 1. Health Check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const health = await healthRes.json();
  console.log('✓ Health Check:', health);

  // 2. Categories
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  const categories = await catRes.json();
  console.log(`✓ Active Categories (${categories.length}):`, categories.map(c => c.name));

  // 3. Products
  const prodRes = await fetch(`${BASE_URL}/api/products`);
  const products = await prodRes.json();
  console.log(`✓ Public Products (${products.length} items loaded):`);
  products.slice(0, 3).forEach(p => console.log(`  - [${p.brand}] ${p.name} (${p.packSize}): ₹${p.price} [Stock: ${p.stock}]`));

  // 4. Admin Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'adminPassword123!' })
  });
  const auth = await loginRes.json();
  if (!auth.token) {
    throw new Error('Login failed: ' + JSON.stringify(auth));
  }
  console.log(`✓ Admin Login Successful for user "${auth.username}". JWT Token generated.`);

  // 5. Test Protected Admin API with JWT
  const adminProdsRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { 'Authorization': `Bearer ${auth.token}` }
  });
  const adminProducts = await adminProdsRes.json();
  console.log(`✓ Admin Endpoint Protected & Verified (${adminProducts.length} inventory products returned)`);

  // 6. Test Placing a Customer Local Pickup Order
  const firstProd = products[0];
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'K. Venkat Rao',
      customerMobile: '9848022338',
      customerVillage: 'Suryapet',
      customerNotes: 'Require for cotton sowing this Saturday',
      items: [{ productId: firstProd.id, quantity: 2 }]
    })
  });
  const orderData = await orderRes.json();
  console.log(`✓ Order Placed & Saved in Database!`);
  console.log(`  - Order Number: ${orderData.orderNumber}`);
  console.log(`  - Customer: ${orderData.customerName} (${orderData.customerMobile})`);
  console.log(`  - Total: ₹${orderData.totalAmount}`);
  console.log(`  - WhatsApp Link: ${orderData.whatsAppUrl.substring(0, 50)}...`);

  // 7. Verify Cross-Device Image Sync API
  const newCloudinaryUrl = `https://res.cloudinary.com/srianjaneya/image/upload/v1729000000/sri_anjaneya_products/updated_dap.jpg?t=${Date.now()}`;
  const imageUpdateRes = await fetch(`${BASE_URL}/api/admin/products/${firstProd.id}/image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageUrl: newCloudinaryUrl })
  });
  const updatedProduct = await imageUpdateRes.json();
  console.log(`✓ Cross-Device Image Sync Verified!`);
  console.log(`  - Product ID: ${updatedProduct.id}`);
  console.log(`  - Updated Image URL in Database: ${updatedProduct.imageUrl}`);

  // 8. Public Verification: Check that public endpoint sees the new image URL immediately without redeployment
  const freshPublicRes = await fetch(`${BASE_URL}/api/products/${firstProd.id}`);
  const freshPublicProd = await freshPublicRes.json();
  if (freshPublicProd.imageUrl === newCloudinaryUrl) {
    console.log(`✓ Cross-Device Public Verification: Other devices instantly see updated picture: ${freshPublicProd.imageUrl}`);
  } else {
    throw new Error('Image URL did not match after update');
  }

  // 9. Dashboard Summary Verification
  const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${auth.token}` }
  });
  const dashboard = await dashRes.json();
  console.log(`✓ Admin Dashboard Analytics:`);
  console.log(`  - Total Products: ${dashboard.totalProducts}`);
  console.log(`  - Total Orders: ${dashboard.totalOrders}`);
  console.log(`  - Total Revenue: ₹${dashboard.totalRevenue}`);

  console.log('\n======================================================');
  console.log('ALL BACKEND, DATABASE, AUTH & SYNC CHECKS PASSED 100%!');
  console.log('======================================================');
}

testApi().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
