const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/', orderRoutes);

app.listen(PORT, () => {
  console.log(`[Order Service] Running on http://localhost:${PORT}`);
});
