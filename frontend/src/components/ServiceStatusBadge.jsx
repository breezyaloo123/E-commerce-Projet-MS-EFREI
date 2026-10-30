import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Activity, RefreshCw } from 'lucide-react';

export default function ServiceStatusBadge() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.checkHealth();
      setHealthData(res.data);
    } catch {
      setHealthData({ gateway: 'DOWN', services: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="health-strip">
      <div className="container health-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} color="#818cf8" />
          <span>Statut Microservices en temps réel:</span>
        </div>

        <div className="health-badges">
          <span className="service-badge">
            <span className={`dot ${healthData?.gateway === 'UP' ? 'dot-up' : 'dot-down'}`}></span>
            Gateway:5000
          </span>

          {healthData?.services?.map((s) => (
            <span key={s.service} className="service-badge">
              <span className={`dot ${s.status === 'UP' ? 'dot-up' : 'dot-down'}`}></span>
              {s.service.replace('-service', '')}
              {s.latencyMs !== undefined && ` (${s.latencyMs}ms)`}
            </span>
          ))}

          <button
            onClick={fetchHealth}
            style={{ background: 'transparent', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
            title="Rafraîchir statut"
          >
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
