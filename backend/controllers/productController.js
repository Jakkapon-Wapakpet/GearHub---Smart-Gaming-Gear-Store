const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// @desc    Get all products (with optional filtering by category and search)
// @route   GET /api/products
// @access  Public
async function getProducts(req, res) {
  try {
    const db = getDB();
    const productsCollection = db.collection('products');

    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await productsCollection.find(filter).toArray();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
async function getProductById(req, res) {
  try {
    const db = getDB();
    const productsCollection = db.collection('products');

    const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: "Invalid ID or server error" });
  }
}

// @desc    Compare products (up to 3 products)
// @route   GET /api/products/compare
// @access  Public
async function getCompareProducts(req, res) {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "No product IDs provided" });
    }

    const idList = ids.split(',').map(id => new ObjectId(id.trim()));

    if (idList.length > 3) {
      return res.status(400).json({ message: "You can compare up to 3 products only" });
    }

    const db = getDB();
    const productsCollection = db.collection('products');

    const products = await productsCollection.find({ _id: { $in: idList } }).toArray();

    res.json(products);
  } catch (error) {
    console.error("Compare products error:", error);
    res.status(500).json({ message: "Invalid product IDs or server error" });
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
async function createProduct(req, res) {
  const { name, description, category, price, stock, images, specifications, tags } = req.body;

  if (!name || !category || price === undefined || stock === undefined || !specifications) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  try {
    const db = getDB();
    const productsCollection = db.collection('products');

    const newProduct = {
      name,
      description: description || "",
      category,
      price: Number(price),
      stock: Number(stock),
      images: images || [],
      specifications,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await productsCollection.insertOne(newProduct);
    const createdProduct = await productsCollection.findOne({ _id: result.insertedId });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(400).json({ message: error.message || "Failed to create product" });
  }
}

module.exports = { getProducts, getProductById, getCompareProducts, createProduct };
