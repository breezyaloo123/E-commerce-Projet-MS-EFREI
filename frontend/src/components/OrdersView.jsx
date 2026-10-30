import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, RefreshCw } from 'lucide-react';

export default function OrdersView() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders(isAuthenticated ? user.id : null);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Historique des Commandes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Données servies par l'<strong>Order Service (Port 5003)</strong>
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchOrders} style={{ padding: '8px 14px' }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Chargement des commandes...
        </p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Package size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3>Aucune commande pour le moment</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Ajoutez des produits au panier et passez votre première commande !</p>
        </div>
      ) : (
        <div className="orders-table-wrap">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-top">
                <div>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', marginRight: '10px' }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>
                <span className={`status-chip status-${order.status}`}>{order.status}</span>
              </div>

              <div style={{ margin: '12px 0' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <strong>Client:</strong> {order.customerName} ({order.customerEmail})
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <strong>Livraison:</strong> {order.shippingAddress}
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '6px' }}>Articles commandés :</div>
                {order.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                    <span>{it.quantity}x {it.name}</span>
                    <span>{(it.price * it.quantity).toFixed(2)} €</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '6px', fontWeight: 800 }}>
                  <span>Montant Total :</span>
                  <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>{order.totalAmount.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
