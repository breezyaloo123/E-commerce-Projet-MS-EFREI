const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`[Auth Service] Running on http://localhost:${PORT}`);
});
