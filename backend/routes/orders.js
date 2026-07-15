const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Please sign in to place orders' });
    const order = await Order.create({ ...req.body, buyerId: userId });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.json([]);
    const orders = await Order.find({ buyerId: userId }).populate('products.productId', 'title');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
