const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { requireAuth } = require('@clerk/express');

// @route   GET api/customers
// @desc    Get all customers for the logged-in user
router.get('/', requireAuth(), async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.auth.userId }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/customers
// @desc    Create a new customer
router.post('/', requireAuth(), async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const newCustomer = new Customer({
            name,
            email,
            phone,
            createdBy: req.auth.userId
        });
        const customer = await newCustomer.save();
        res.json(customer);
    } catch (err) {
        if (err.code === 11000) { // Duplicate email error
            return res.status(400).json({ msg: 'A customer with this email already exists.' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/customers/:id
// @desc    Delete a customer
router.delete('/:id', requireAuth(), async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        // Ensure the user owns the customer record
        if (customer.createdBy.toString() !== req.auth.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await customer.deleteOne();

        res.json({ msg: 'Customer removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router; 