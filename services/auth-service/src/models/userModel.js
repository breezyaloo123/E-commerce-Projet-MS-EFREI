const bcrypt = require('bcryptjs');

// In-memory mock store for demo & starter purposes.
// Easily replace with MongoDB / PostgreSQL / Prisma model.
let users = [
  {
    id: 'user-1',
    name: 'Alice Demo',
    email: 'alice@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'customer',
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-1',
    name: 'Admin Store',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  findByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  findById: (id) => users.find(u => u.id === id),
  create: async ({ name, email, password, role = 'customer' }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },
  all: () => users.map(({ passwordHash, ...rest }) => rest)
};
