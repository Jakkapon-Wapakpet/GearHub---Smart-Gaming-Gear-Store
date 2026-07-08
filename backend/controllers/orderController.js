const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
async function createOrder(req, res) {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0 || !shippingAddress || !paymentMethod || totalAmount === undefined) {
    return res.status(400).json({ message: "Please enter all required order details" });
  }

  try {
    const db = getDB();
    const ordersCollection = db.collection('orders');
    const productsCollection = db.collection('products');

    // Format items with ObjectIds and verify/update stock
    const formattedItems = [];
    for (const item of items) {
      const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      formattedItems.push({
        productId: new ObjectId(item.productId),
        name: product.name,
        price: Number(item.price || product.price),
        quantity: Number(item.quantity)
      });
    }

    const newOrder = {
      userId: new ObjectId(req.user.userId),
      orderDate: new Date(),
      items: formattedItems,
      shippingAddress: {
        receiverName: shippingAddress.receiverName,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        subDistrict: shippingAddress.subDistrict,
        district: shippingAddress.district,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode
      },
      paymentMethod,
      totalAmount: Number(totalAmount),
      status: "Paid", // Defaults to Paid for simulation
      updatedAt: new Date()
    };

    // Optional: Add tracking number for PromptPay
    if (paymentMethod === "PromptPay") {
      newOrder.trackingNumber = "FL-GP-" + Math.floor(100000 + Math.random() * 900000);
    }

    // Insert order (verifies against schema rules)
    const result = await ordersCollection.insertOne(newOrder);

    // Update stocks
    for (const item of formattedItems) {
      await productsCollection.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    const createdOrder = await ordersCollection.findOne({ _id: result.insertedId });
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(400).json({ message: error.message || "Failed to place order" });
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
async function getMyOrders(req, res) {
  try {
    const db = getDB();
    const ordersCollection = db.collection('orders');

    const orders = await ordersCollection
      .find({ userId: new ObjectId(req.user.userId) })
      .sort({ orderDate: -1 })
      .toArray();

    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
async function getOrders(req, res) {
  try {
    const db = getDB();
    const ordersCollection = db.collection('orders');

    const orders = await ordersCollection
      .find({})
      .sort({ orderDate: -1 })
      .toArray();

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
async function updateOrderStatus(req, res) {
  const { status, trackingNumber } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Please provide order status" });
  }

  try {
    const db = getDB();
    const ordersCollection = db.collection('orders');

    const updateFields = {
      status,
      updatedAt: new Date()
    };

    if (trackingNumber) {
      updateFields.trackingNumber = trackingNumber;
    }

    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createOrder, getMyOrders, getOrders, updateOrderStatus };
