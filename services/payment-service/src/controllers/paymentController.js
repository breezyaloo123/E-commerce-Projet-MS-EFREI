let transactions = [
  {
    transactionId: 'txn-demo-1',
    orderId: 'ord-1001',
    amount: 199.99,
    currency: 'EUR',
    status: 'SUCCESS',
    method: 'card',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// POST /process
exports.processPayment = (req, res) => {
  const { orderId, amount, currency = 'EUR', paymentMethod = 'card' } = req.body;

  if (!orderId || amount === undefined) {
    return res.status(400).json({ error: 'orderId and amount are required' });
  }

  // Simulate payment processing (ready for Stripe / PayPal webhook / SDK)
  const isSuccessful = true; // In real life: await stripe.paymentIntents.create(...)

  const transaction = {
    transactionId: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    orderId,
    amount,
    currency,
    method: paymentMethod,
    status: isSuccessful ? 'SUCCESS' : 'FAILED',
    timestamp: new Date().toISOString()
  };

  transactions.unshift(transaction);

  return res.status(200).json({
    message: 'Payment processed successfully',
    transactionId: transaction.transactionId,
    status: transaction.status,
    amount,
    currency
  });
};

// GET /status/:transactionId
exports.getTransaction = (req, res) => {
  const txn = transactions.find(t => t.transactionId === req.params.transactionId);
  if (!txn) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  return res.json(txn);
};

// GET /transactions
exports.getAllTransactions = (req, res) => {
  return res.json(transactions);
};
