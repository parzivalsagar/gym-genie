const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

const connectDB = async () => {
  if (cached) return cached;
  cached = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  return cached;
};

const ensureDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
};

app.get('/api/health', ensureDB, (req, res) => res.json({ status: 'ok' }));

app.use('/api/products', ensureDB, productRoutes);
app.use('/api/cart', ensureDB, cartRoutes);
app.use('/api/orders', ensureDB, orderRoutes);
app.use('/api/reviews', ensureDB, reviewRoutes);
app.use('/api/chat', ensureDB, chatRoutes);
app.use('/api/admin', ensureDB, adminRoutes);
app.use('/api/upload', ensureDB, uploadRoutes);

app.post('/api/sync-user', ensureDB, async (req, res) => {
  try {
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
