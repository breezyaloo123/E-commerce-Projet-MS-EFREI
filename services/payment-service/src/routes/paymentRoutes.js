const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/process', paymentController.processPayment);
router.get('/status/:transactionId', paymentController.getTransaction);
router.get('/transactions', paymentController.getAllTransactions);

module.exports = router;
