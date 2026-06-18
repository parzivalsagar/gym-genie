const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

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

let dbReady = null;

const connectDB = () => {
  if (!dbReady) {
    dbReady = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
  }
  return dbReady;
};

connectDB().catch(err => console.error('DB connection error:', err.message));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.post('/api/sync-user', async (req, res) => {
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
