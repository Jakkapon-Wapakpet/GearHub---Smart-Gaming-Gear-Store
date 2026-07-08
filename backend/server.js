require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Base status route
  app.get('/', (req, res) => {
    res.json({ message: "Welcome to GearHub API Server!", status: "Running" });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

  // 404 Route handler
  app.use((req, res, next) => {
    res.status(404).json({ message: "API Route Not Found" });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  });

  // Listen
  app.listen(PORT, () => {
    console.log(`🚀 GearHub Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Failed to connect database. Server starting terminated.", err);
  process.exit(1);
});
