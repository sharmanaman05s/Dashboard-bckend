const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Using a custom ID like "ORD001" is better handled at the application level
  // MongoDB will automatically provide a unique _id.
  // We can add another field for a human-readable ID if needed.
  customer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // Example of linking to another collection if you have users
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 