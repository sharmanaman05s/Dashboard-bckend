const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route Imports
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// Unauthenticated route
app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

// A simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 