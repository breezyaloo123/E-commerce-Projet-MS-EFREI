import React from 'react';
import { ShoppingBag, ShoppingCart, User, Layers, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <div className="brand" role="button" onClick={() => setActiveTab('shop')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span>NovaStore <span style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Microservices</span></span>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            Boutique
          </button>
          <button
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Mes Commandes
          </button>
          <button
            className={`nav-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Layers size={16} />
            Architecture
          </button>
        </nav>

        {/* User Actions & Cart */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {user.name.split(' ')[0]}
              </span>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px' }}
                onClick={logout}
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={onOpenAuth}>
              <User size={16} />
              Connexion
            </button>
          )}

          <button
            className="btn-cart"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Voir le panier"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
