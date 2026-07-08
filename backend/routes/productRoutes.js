const express = require('express');
const { getProducts, getProductById, getCompareProducts, createProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/compare', getCompareProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);

module.exports = router;
