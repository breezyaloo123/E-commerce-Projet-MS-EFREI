const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/', productRoutes);

app.listen(PORT, () => {
  console.log(`[Product Service] Running on http://localhost:${PORT}`);
});
