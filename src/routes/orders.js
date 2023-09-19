const express = require('express');
const router = express.Router();
const { getOrders,
    updateOrders,
    addOrders,
    getOrderById,
    getStatistics
} = require('../controllers/orders')

// Order
router
    .get('/', getOrders)
    .get('/statistics', getStatistics)
    .get('/:id', getOrderById)
    .post('/', addOrders)
    .patch('/:id', updateOrders)

// Statistics


module.exports = router;
