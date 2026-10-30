import React, { useState } from 'react';
import { X, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CartDrawer({ onOrderSuccess }) {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [address, setAddress] = useState('15 Avenue des Champs-Élysées, 75008 Paris');
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isDrawerOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        userId: isAuthenticated ? user.id : 'guest-' + Date.now(),
        customerName: isAuthenticated ? user.name : 'Client Invité',
        customerEmail: isAuthenticated ? user.email : 'invite@boutique.fr',
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentDetails: {
          method: 'carte_bancaire'
        }
      };

      const res = await api.createOrder(orderPayload);
      setSuccessOrder(res.data.order);
      clearCart();
      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Erreur lors de la création de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessOrder(null);
    setErrorMsg('');
    setIsDrawerOpen(false);
  };

  return (
    <div className="drawer-backdrop" onClick={handleClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Votre Panier ({cart.length})</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {successOrder ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Commande Confirmée !</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Numéro de commande: <strong>{successOrder.id}</strong>
              </p>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'left', marginBottom: '24px' }}>
                <p><strong>Statut:</strong> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{successOrder.status}</span> (Payée via Microservice Paiement)</p>
                <p><strong>Total:</strong> {successOrder.totalAmount} €</p>
                <p><strong>Livraison:</strong> {successOrder.shippingAddress}</p>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={handleClose}>
                Continuer mes achats
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <p>Votre panier est vide pour le moment.</p>
            </div>
          ) : (
            <>
              {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{item.price.toFixed(2)} €</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'transparent', color: '#94a3b8' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Adresse de livraison :
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresse complète..."
                />
              </div>
            </>
          )}
        </div>

        {!successOrder && cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>Total TTC :</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={submitting}
              onClick={handleCheckout}
            >
              {submitting ? 'Traitement en cours...' : 'Commander & Payer'}
              <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              🔒 Flux inter-microservices sécurisé (Gateway → Orders → Payments)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
