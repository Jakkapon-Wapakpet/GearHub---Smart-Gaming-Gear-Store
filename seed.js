const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Connection URI (Default to local MongoDB)
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = "gearhub";

async function main() {
  const client = new MongoClient(uri);

  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully to server");

    const db = client.db(dbName);

    // Read Schema JSON files
    const userSchemaData = JSON.parse(fs.readFileSync(path.join(__dirname, "05_mongodb.schema_user.json"), "utf8"));
    const productSchemaData = JSON.parse(fs.readFileSync(path.join(__dirname, "06_mongodb-schema_products.json"), "utf8"));
    const orderSchemaData = JSON.parse(fs.readFileSync(path.join(__dirname, "07_mongodb-shcema_orders.json"), "utf8"));

    const collections = [
      { name: "users", schema: userSchemaData.schema },
      { name: "products", schema: productSchemaData.schema },
      { name: "orders", schema: orderSchemaData.schema }
    ];

    for (const col of collections) {
      // Check if collection exists
      const existingCollections = await db.listCollections({ name: col.name }).toArray();
      if (existingCollections.length > 0) {
        console.log(`🗑️ Dropping existing collection: ${col.name}`);
        await db.collection(col.name).drop();
      }

      // Create collection with Schema Validation
      console.log(`📦 Creating collection with schema validation: ${col.name}`);
      await db.createCollection(col.name, {
        validator: {
          $jsonSchema: col.schema
        }
      });
    }

    // --- SEED DATA ---
    console.log("🌱 Seeding data...");

    // 1. Seed Users
    const usersCollection = db.collection("users");
    const seedUsers = [
      {
        username: "pete_esports",
        email: "pete.p@example.com",
        password: "$2b$10$hashedpasswordforpete1234567890", // Mock Bcrypt Hash
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "fah_aesthetic",
        email: "fah.beauty@example.com",
        password: "$2b$10$hashedpasswordforfah1234567890",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "kong_tech",
        email: "kong.code@example.com",
        password: "$2b$10$hashedpasswordforkong1234567890",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "wan_gift",
        email: "wan.mom@example.com",
        password: "$2b$10$hashedpasswordforwan1234567890",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "admin_gearhub",
        email: "admin@gearhub.com",
        password: "$2b$10$hashedpasswordforadmin1234567890",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const userInsertResult = await usersCollection.insertMany(seedUsers);
    console.log(`✅ Seeded ${userInsertResult.insertedCount} users.`);

    // Get mapped IDs for referencing in orders
    const peteId = userInsertResult.insertedIds[0];
    const fahId = userInsertResult.insertedIds[1];
    const kongId = userInsertResult.insertedIds[2];
    const wanId = userInsertResult.insertedIds[3];

    // 2. Seed Products
    const productsCollection = db.collection("products");
    const seedProducts = [
      {
        name: "Razer Viper V3 Pro",
        description: "The GOAT of wireless gaming mice, designed with esports pros for lightweight performance.",
        category: "Mouse",
        price: 5390.0,
        stock: 45,
        images: ["/images/products/viper-v3-pro-white.png"],
        specifications: {
          color: "White",
          connection: "Wireless 2.4GHz / Wired",
          weight: "54g",
          sensor: "Focus Pro 35K Optical Sensor Gen-2",
          pollingRate: "8000Hz",
          batteryLife: "Up to 95 hours"
        },
        tags: ["white", "lightweight", "wireless", "esports"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Logitech G Pro X Superlight 2",
        description: "Fast and precise wireless gaming mouse trusted by top esports athletes.",
        category: "Mouse",
        price: 4990.0,
        stock: 30,
        images: ["/images/products/g-pro-superlight-2-black.png"],
        specifications: {
          color: "Black",
          connection: "Wireless 2.4GHz / Wired",
          weight: "60g",
          sensor: "HERO 2 Sensor",
          pollingRate: "4000Hz",
          batteryLife: "Up to 95 hours"
        },
        tags: ["black", "lightweight", "wireless", "esports"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Keychron Q1 Pro",
        description: "Premium QMK/VIA wireless custom mechanical keyboard with CNC aluminum body.",
        category: "Keyboard",
        price: 5900.0,
        stock: 15,
        images: ["/images/products/keychron-q1-pro.png"],
        specifications: {
          color: "Carbon Gray",
          connection: "Bluetooth 5.1 / Wired",
          weight: "1.8kg",
          switchType: "Keychron K Pro Red (Linear)",
          hotSwappable: true
        },
        tags: ["premium", "aluminum", "wireless", "custom", "mechanical"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Royal Kludge RK61",
        description: "Compact 60% mechanical keyboard, perfect for aesthetic desk setups.",
        category: "Keyboard",
        price: 1450.0,
        stock: 60,
        images: ["/images/products/rk61-pink.png"],
        specifications: {
          color: "Pink",
          connection: "Bluetooth / 2.4GHz / Wired",
          weight: "600g",
          switchType: "RK Red Switch (Linear)",
          hotSwappable: true
        },
        tags: ["pink", "compact", "wireless", "budget", "mechanical"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "HyperX Cloud III",
        description: "Comfortable gaming headset with outstanding sound durability.",
        category: "Headset",
        price: 3290.0,
        stock: 25,
        images: ["/images/products/cloud-iii-red-black.png"],
        specifications: {
          color: "Red/Black",
          connection: "Wired USB/3.5mm",
          weight: "300g"
        },
        tags: ["wired", "comfortable", "durable", "clear-mic"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const productInsertResult = await productsCollection.insertMany(seedProducts);
    console.log(`✅ Seeded ${productInsertResult.insertedCount} products.`);

    const viperId = productInsertResult.insertedIds[0];
    const rk61Id = productInsertResult.insertedIds[3];
    const keychronId = productInsertResult.insertedIds[2];
    const cloudIiiId = productInsertResult.insertedIds[4];

    // 3. Seed Orders
    const ordersCollection = db.collection("orders");
    const seedOrders = [
      {
        userId: peteId,
        orderDate: new Date(),
        items: [
          {
            productId: viperId,
            name: "Razer Viper V3 Pro",
            price: 5390.0,
            quantity: 1
          }
        ],
        shippingAddress: {
          receiverName: "พีท วรเมธ",
          phone: "0812345678",
          addressLine: "456/7 คอนโดวินด์มิลล์ ชั้น 12",
          subDistrict: "ห้วยขวาง",
          district: "ห้วยขวาง",
          province: "กรุงเทพมหานคร",
          postalCode: "10310"
        },
        paymentMethod: "PromptPay",
        totalAmount: 5390.0,
        status: "Paid",
        trackingNumber: "FL-VIP-001234",
        updatedAt: new Date()
      },
      {
        userId: fahId,
        orderDate: new Date(),
        items: [
          {
            productId: rk61Id,
            name: "Royal Kludge RK61",
            price: 1450.0,
            quantity: 1
          }
        ],
        shippingAddress: {
          receiverName: "ฟ้า วนิดา",
          phone: "0898765432",
          addressLine: "789 หมู่บ้านแสนสุข ซอย 12",
          subDistrict: "บางนา",
          district: "บางนา",
          province: "กรุงเทพมหานคร",
          postalCode: "10260"
        },
        paymentMethod: "DebitCard",
        totalAmount: 1450.0,
        status: "Paid",
        trackingNumber: "FL-FAH-005678",
        updatedAt: new Date()
      },
      {
        userId: kongId,
        orderDate: new Date(),
        items: [
          {
            productId: keychronId,
            name: "Keychron Q1 Pro",
            price: 5900.0,
            quantity: 1
          }
        ],
        shippingAddress: {
          receiverName: "ก้อง เกริกพล",
          phone: "0855551234",
          addressLine: "12/3 หมู่บ้านสราญสิริ",
          subDistrict: "คลองกุ่ม",
          district: "บึงกุ่ม",
          province: "กรุงเทพมหานคร",
          postalCode: "10240"
        },
        paymentMethod: "Installment",
        totalAmount: 5900.0,
        status: "Processing",
        updatedAt: new Date()
      },
      {
        userId: wanId,
        orderDate: new Date(),
        items: [
          {
            productId: cloudIiiId,
            name: "HyperX Cloud III",
            price: 3290.0,
            quantity: 1
          }
        ],
        shippingAddress: {
          receiverName: "แม่วรรณ จิราภรณ์",
          phone: "0823456789",
          addressLine: "98/76 ถ.พหลโยธิน",
          subDistrict: "สามเสนใน",
          district: "พญาไท",
          province: "กรุงเทพมหานคร",
          postalCode: "10400"
        },
        paymentMethod: "CreditCard",
        totalAmount: 3290.0,
        status: "Delivered",
        trackingNumber: "EMS-WAN-998877",
        updatedAt: new Date()
      }
    ];

    const orderInsertResult = await ordersCollection.insertMany(seedOrders);
    console.log(`✅ Seeded ${orderInsertResult.insertedCount} orders.`);

    console.log("\n🎉 Database initialization completed successfully!");
  } catch (err) {
    console.error("❌ Error during database seed:", err);
  } finally {
    await client.close();
    console.log("🔌 Connection closed.");
  }
}

main();
