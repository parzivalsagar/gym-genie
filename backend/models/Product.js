const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, enum: ['New', 'Used'], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
  location: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'pending', 'rejected'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
