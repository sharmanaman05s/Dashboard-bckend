const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
// const { ClerkExpressRequireAuth } = require('@clerk/backend');
const { requireAuth } = require('@clerk/express');


// @route   GET api/orders
// @desc    Get all orders for the logged-in user
router.get('/', requireAuth(), async (req, res) => {
  try {
    // req.auth is available after the middleware runs.
    // We can filter by req.auth.userId if we save it on the order
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/orders
// @desc    Create an order for the logged-in user
router.post('/', requireAuth(), async (req, res) => {
    const { customer, total, status } = req.body;
    try {
        const newOrder = new Order({
            customer,
            total,
            status,
            // userId: req.auth.userId // <-- Associate order with the user
        });
        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/orders/:id
// @desc    Delete an order
router.delete('/:id', requireAuth(), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        
        // Optional: Check if the user owns the order
        // if (order.userId.toString() !== req.auth.userId) {
        //     return res.status(401).json({ msg: 'Not authorized' });
        // }

        await order.deleteOne();

        res.json({ msg: 'Order removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/orders/:id
// @desc    Update an order's status
router.put('/:id', requireAuth(), async (req, res) => {
    const { status } = req.body;

    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Optional: Check ownership
        // if (order.userId.toString() !== req.auth.userId) {
        //     return res.status(401).json({ msg: 'Not authorized' });
        // }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// We will add more routes for GET (single), PUT (update), and DELETE later.

module.exports = router; 