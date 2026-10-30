const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'payment-service', status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/', paymentRoutes);

app.listen(PORT, () => {
  console.log(`[Payment Service] Running on http://localhost:${PORT}`);
});
