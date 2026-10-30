const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004';

// Middlewares
app.use(cors());
app.use(morgan('dev'));

// Aggregated health check
app.get('/api/health', async (req, res) => {
  const checkService = async (name, url) => {
    const start = Date.now();
    try {
      await axios.get(`${url}/health`, { timeout: 2000 });
      return { service: name, status: 'UP', latencyMs: Date.now() - start };
    } catch (err) {
      return { service: name, status: 'DOWN', latencyMs: Date.now() - start, error: err.message };
    }
  };

  const results = await Promise.all([
    checkService('auth-service', AUTH_SERVICE_URL),
    checkService('product-service', PRODUCT_SERVICE_URL),
    checkService('order-service', ORDER_SERVICE_URL),
    checkService('payment-service', PAYMENT_SERVICE_URL)
  ]);

  const allUp = results.every(s => s.status === 'UP');

  res.status(allUp ? 200 : 207).json({
    gateway: 'UP',
    timestamp: new Date().toISOString(),
    services: results
  });
});

// Proxies
// 1. Auth Service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' }
  })
);

// 2. Product Service
app.use(
  '/api/products',
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/products': '' }
  })
);

// 3. Order Service
app.use(
  '/api/orders',
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '' }
  })
);

// 4. Payment Service
app.use(
  '/api/payments',
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/payments': '' }
  })
);

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found on API Gateway' });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on http://localhost:${PORT}`);
  console.log(` -> Auth Service target: ${AUTH_SERVICE_URL}`);
  console.log(` -> Product Service target: ${PRODUCT_SERVICE_URL}`);
  console.log(` -> Order Service target: ${ORDER_SERVICE_URL}`);
  console.log(` -> Payment Service target: ${PAYMENT_SERVICE_URL}`);
});
