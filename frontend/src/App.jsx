import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ServiceStatusBadge from './components/ServiceStatusBadge';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import OrdersView from './components/OrdersView';
import api from './services/api';
import { Search, Sparkles, Server, ShieldCheck, ShoppingCart, CreditCard, Network } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Tous']);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Fetch products & categories
  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({
          category: selectedCategory !== 'Tous' ? selectedCategory : undefined,
          search: searchTerm || undefined
        }),
        api.getCategories()
      ]);
      setProducts(prodRes.data.products);
      if (catRes.data.categories) {
        setCategories(catRes.data.categories);
      }
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="app-layout">
      {/* Real-time Health bar for all microservices */}
      <ServiceStatusBadge />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="container">
        {activeTab === 'shop' && (
          <>
            {/* Hero Section */}
            <section className="hero">
              <span className="hero-tag">
                <Sparkles size={14} /> Architecture Microservices Évolutive
              </span>
              <h1>La Boutique Tech Nouvelle Génération</h1>
              <p>
                Propulsée par 5 microservices autonomes en Node.js, Express & React.
                Découvrez le découpage modulaire haute performance.
              </p>
            </section>

            {/* Filter and Search Bar */}
            <div className="controls-bar">
              <div className="search-box">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Rechercher un produit (casque, montre, clavier)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <p>Chargement du catalogue depuis le Product Service...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <p>Aucun produit ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <OrdersView />
        )}

        {activeTab === 'architecture' && (
          <div className="arch-card">
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
              Architecture des Microservices E-Commerce
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Chaque microservice est isolé, possède son propre cycle de vie, ses dépendances et peut être conteneurisé indépendamment.
            </p>

            <div className="arch-grid">
              <div className="service-box">
                <h4><Network size={18} color="var(--primary)" /> API Gateway</h4>
                <p>Point d'entrée unique (Reverse Proxy avec <code>http-proxy-middleware</code>), routage, agrégation de health checks, CORS et sécurité.</p>
                <code>Port: 5000 | /api/*</code>
              </div>

              <div className="service-box">
                <h4><ShieldCheck size={18} color="#0284c7" /> Auth Service</h4>
                <p>Gestion des utilisateurs, hachage bcrypt, génération et validation des tokens JWT, profils clients et rôles (admin/customer).</p>
                <code>Port: 5001 | /api/auth/*</code>
              </div>

              <div className="service-box">
                <h4><Server size={18} color="#16a34a" /> Product Service</h4>
                <p>Gestion du catalogue de produits, recherche, filtrage par catégorie, gestion des stocks et fiches articles.</p>
                <code>Port: 5002 | /api/products/*</code>
              </div>

              <div className="service-box">
                <h4><ShoppingCart size={18} color="#ca8a04" /> Order Service</h4>
                <p>Gestion des paniers et commandes, persistance de l'historique et orchestration de la transaction avec le service de paiement.</p>
                <code>Port: 5003 | /api/orders/*</code>
              </div>

              <div className="service-box">
                <h4><CreditCard size={18} color="#0891b2" /> Payment Service</h4>
                <p>Traitement des paiements (prêt pour Stripe/PayPal/Webhooks), validation des transactions et émission des reçus.</p>
                <code>Port: 5004 | /api/payments/*</code>
              </div>
            </div>

            <div style={{ marginTop: '28px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>🚀 Comment démarrer en local ?</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                <li><code>npm run install:all</code> : installe toutes les dépendances des microservices et du frontend en une seule commande.</li>
                <li><code>npm run dev</code> : démarre l'ensemble des 5 microservices et le frontend React avec logs colorés via Concurrently.</li>
                <li><code>docker-compose up --build</code> : orchestre tous les conteneurs avec réseau Docker unifié.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Cart Slider / Drawer */}
      <CartDrawer onOrderSuccess={() => setActiveTab('orders')} />

      {/* Login / Register Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
