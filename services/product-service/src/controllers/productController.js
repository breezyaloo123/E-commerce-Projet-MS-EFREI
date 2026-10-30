let products = require('../data/sampleProducts');

// GET /products
exports.getAllProducts = (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== 'Tous') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.json({
    count: result.length,
    products: result
  });
};

// GET /products/categories
exports.getCategories = (req, res) => {
  const categories = ['Tous', ...new Set(products.map(p => p.category))];
  res.json({ categories });
};

// GET /products/:id
exports.getProductById = (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
};

// POST /products
exports.createProduct = (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    description: description || '',
    price: Number(price),
    category: category || 'Divers',
    stock: stock !== undefined ? Number(stock) : 10,
    rating: 5.0,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
};

// PUT /products/:id
exports.updateProduct = (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
};

// DELETE /products/:id
exports.deleteProduct = (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', product: deleted[0] });
};
