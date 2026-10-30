import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Health
  checkHealth: () => client.get('/health'),

  // Products
  getProducts: (params = {}) => client.get('/products', { params }),
  getProductById: (id) => client.get(`/products/${id}`),
  getCategories: () => client.get('/products/categories'),

  // Auth
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
  getProfile: () => client.get('/auth/profile'),

  // Orders
  getOrders: (userId) => client.get('/orders', { params: userId ? { userId } : {} }),
  getOrderById: (id) => client.get(`/orders/${id}`),
  createOrder: (orderData) => client.post('/orders', orderData)
};

export default api;
