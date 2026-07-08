const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is not defined in environment variables!");
  process.exit(1);
}

const client = new MongoClient(uri);
let db = null;

async function connectDB() {
  if (db) return db;
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await client.connect();
    db = client.db("gearhub");
    console.log("✅ Connected successfully to MongoDB Atlas (gearhub)");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

module.exports = { connectDB, getDB };
