const axios = require('axios');
const OrderModel = require('../models/orderModel');

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004';

// GET /orders
exports.getAllOrders = (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(OrderModel.getByUserId(userId));
  }
  return res.json(OrderModel.getAll());
};

// GET /orders/:id
exports.getOrderById = (req, res) => {
  const order = OrderModel.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
};

// POST /orders
exports.createOrder = async (req, res) => {
  try {
    const { userId, customerName, customerEmail, items, shippingAddress, paymentDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    // Initial order creation
    const order = OrderModel.create({
      userId: userId || 'guest',
      customerName: customerName || 'Client Invité',
      customerEmail: customerEmail || 'guest@example.com',
      items,
      totalAmount: Math.round(totalAmount * 100) / 100,
      shippingAddress: shippingAddress || 'Non renseignée'
    });

    // Inter-service call to Payment Service
    try {
      const paymentResponse = await axios.post(`${PAYMENT_SERVICE_URL}/process`, {
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'EUR',
        paymentMethod: paymentDetails?.method || 'card'
      });

      if (paymentResponse.data && paymentResponse.data.status === 'SUCCESS') {
        order.status = 'PAID';
        order.paymentId = paymentResponse.data.transactionId;
      }
    } catch (payErr) {
      console.warn(`[Order Service] Payment service error for order ${order.id}:`, payErr.message);
      // Order created in PENDING status if payment fails or service offline
    }

    return res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

// PATCH /orders/:id/status
exports.updateOrderStatus = (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = OrderModel.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json({ message: 'Order status updated', order: updated });
};
