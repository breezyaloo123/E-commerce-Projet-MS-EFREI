let orders = [
  {
    id: 'ord-1001',
    userId: 'user-1',
    customerName: 'Alice Demo',
    customerEmail: 'alice@example.com',
    items: [
      {
        productId: 'prod-101',
        name: 'Casque Audio Sans Fil Pro ANC',
        price: 199.99,
        quantity: 1
      }
    ],
    totalAmount: 199.99,
    status: 'PAID', // PENDING, PAID, SHIPPED, CANCELLED
    shippingAddress: '12 Rue de la Paix, 75001 Paris, France',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

module.exports = {
  getAll: () => orders,
  getById: (id) => orders.find(o => o.id === id),
  getByUserId: (userId) => orders.filter(o => o.userId === userId),
  create: (orderData) => {
    const newOrder = {
      id: `ord-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...orderData
    };
    orders.unshift(newOrder);
    return newOrder;
  },
  updateStatus: (id, status) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return null;
  }
};
