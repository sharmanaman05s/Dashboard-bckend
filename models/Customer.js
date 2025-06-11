const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  // We will track orders and total spent via separate logic,
  // but we can store the user who created this customer record.
  createdBy: {
    type: String, // This will be the Clerk User ID
    required: true,
  }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 