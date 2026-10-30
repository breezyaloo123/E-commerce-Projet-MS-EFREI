import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'authentification');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoginMode(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'transparent', color: '#94a3b8' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
          {isLoginMode ? 'Connexion' : 'Créer un compte'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Service d'authentification JWT autonome (Auth-Service sur le port 5001)
        </p>

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                className="form-input"
                placeholder="ex: Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Adresse Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="ex: alice@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Chargement...' : isLoginMode ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            style={{ background: 'transparent', color: 'var(--primary)', fontSize: '0.88rem', fontWeight: 600 }}
          >
            {isLoginMode ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>

        {/* Demo Fast Fill */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            ⚡ Comptes de démonstration pré-configurés :
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem', padding: '6px 8px' }}
              onClick={() => fillDemoAccount('alice@example.com', 'password123')}
            >
              Client: Alice
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem', padding: '6px 8px' }}
              onClick={() => fillDemoAccount('admin@example.com', 'admin123')}
            >
              Admin: Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
