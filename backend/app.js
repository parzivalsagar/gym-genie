const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let cached = null;

const ensureDB = async () => {
  if (cached) return cached;
  cached = await connectDB();
  return cached;
};

app.get('/api/health', async (req, res) => {
  await ensureDB();
  res.json({ status: 'ok' });
});

app.use('/api/products', async (req, res, next) => {
  await ensureDB();
  productRoutes(req, res, next);
});
app.use('/api/cart', async (req, res, next) => {
  await ensureDB();
  cartRoutes(req, res, next);
});
app.use('/api/orders', async (req, res, next) => {
  await ensureDB();
  orderRoutes(req, res, next);
});
app.use('/api/reviews', async (req, res, next) => {
  await ensureDB();
  reviewRoutes(req, res, next);
});
app.use('/api/chat', async (req, res, next) => {
  await ensureDB();
  chatRoutes(req, res, next);
});
app.use('/api/admin', async (req, res, next) => {
  await ensureDB();
  adminRoutes(req, res, next);
});
app.use('/api/upload', async (req, res, next) => {
  await ensureDB();
  uploadRoutes(req, res, next);
});

app.post('/api/sync-user', async (req, res) => {
  try {
    await ensureDB();
    const User = require('./models/User');
    const { clerkId, name, email, avatar } = req.body;
    let user = await User.findOne({ clerkId });
    if (user) {
      user = await User.findOneAndUpdate({ clerkId }, { name, email, avatar }, { new: true });
    } else {
      user = await User.create({ clerkId, name, email, avatar });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = app;
