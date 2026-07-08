const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey12345';

// Helper to generate JWT
function generateToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
async function registerUser(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all required fields" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection('users');

    // Check if user exists
    const userExists = await usersCollection.findOne({ 
      $or: [ { email: email.toLowerCase() }, { username: username } ] 
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user (validates against the schema validation rule in MongoDB)
    const result = await usersCollection.insertOne(newUser);
    
    // Fetch inserted user
    const createdUser = await usersCollection.findOne({ _id: result.insertedId });

    res.status(201).json({
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
      token: generateToken(createdUser)
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ message: error.message || "Failed to register user" });
  }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
async function getUserProfile(req, res) {
  try {
    const db = getDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { registerUser, loginUser, getUserProfile };
