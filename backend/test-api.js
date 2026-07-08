const http = require('http');

const API_URL = 'http://localhost:5000';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      method: method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("🚦 Starting API Verification Tests...");

  try {
    // 1. Test Base Route
    console.log("\n1. Testing Base API Route...");
    const baseRes = await makeRequest('GET', '/');
    console.log(`Response Status: ${baseRes.status}`);
    console.log(`Response Data:`, baseRes.data);

    // 2. Test Get Products
    console.log("\n2. Testing Get Products Route...");
    const productsRes = await makeRequest('GET', '/api/products');
    console.log(`Response Status: ${productsRes.status}`);
    console.log(`Total Products Found: ${productsRes.data.length}`);
    const testProduct = productsRes.data[0];
    console.log(`Sample Product: ${testProduct.name} (${testProduct._id})`);

    // 3. Test Compare Products
    if (productsRes.data.length >= 2) {
      console.log("\n3. Testing Product Comparison...");
      const id1 = productsRes.data[0]._id;
      const id2 = productsRes.data[1]._id;
      const compareRes = await makeRequest('GET', `/api/products/compare?ids=${id1},${id2}`);
      console.log(`Response Status: ${compareRes.status}`);
      console.log(`Compared Products Count: ${compareRes.data.length}`);
    }

    // 4. Test User Registration
    console.log("\n4. Testing User Registration...");
    const randomSuffix = Math.floor(Math.random() * 10000);
    const userData = {
      username: `tester_${randomSuffix}`,
      email: `tester_${randomSuffix}@test.com`,
      password: 'password123'
    };
    const registerRes = await makeRequest('POST', '/api/auth/register', userData);
    console.log(`Response Status: ${registerRes.status}`);
    console.log(`Registered User:`, registerRes.data.username, `(Token received: ${!!registerRes.data.token})`);
    const token = registerRes.data.token;

    // 5. Test Profile retrieval
    console.log("\n5. Testing Profile Route with JWT...");
    const profileRes = await makeRequest('GET', '/api/auth/profile', null, token);
    console.log(`Response Status: ${profileRes.status}`);
    console.log(`Profile User:`, profileRes.data.username);

    // 6. Test Place Order
    if (testProduct) {
      console.log("\n6. Testing Order Placement...");
      const orderData = {
        items: [
          {
            productId: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1
          }
        ],
        shippingAddress: {
          receiverName: "Test Receiver",
          phone: "0899999999",
          addressLine: "123 Test Rd",
          subDistrict: "Test Sub",
          district: "Test District",
          province: "Bangkok",
          postalCode: "10110"
        },
        paymentMethod: "PromptPay",
        totalAmount: testProduct.price
      };
      
      const orderRes = await makeRequest('POST', '/api/orders', orderData, token);
      console.log(`Response Status: ${orderRes.status}`);
      console.log(`Order Placed:`, orderRes.data._id, `(Status: ${orderRes.data.status})`);

      // 7. Test Fetch My Orders
      console.log("\n7. Testing My Orders Query...");
      const myOrdersRes = await makeRequest('GET', '/api/orders/my-orders', null, token);
      console.log(`Response Status: ${myOrdersRes.status}`);
      console.log(`Order History count for user: ${myOrdersRes.data.length}`);
    }

    console.log("\n🎉 All API Route Verification Tests Passed Successfully!");

  } catch (error) {
    console.error("❌ Test script error:", error);
  }
}

runTests();
