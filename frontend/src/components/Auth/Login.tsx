import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      if (onSuccess) onSuccess();
      else navigate('/');
    } catch (err: any) {
      const errorDetail = err?.response?.data?.detail;
      let errorMessage: string;
      
      if (typeof errorDetail === 'object' && errorDetail !== null) {
        // Si detail es un objeto, convertir a string legible
        errorMessage = Object.entries(errorDetail)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      } else if (errorDetail) {
        // Si detail es un string, usarlo directamente
        errorMessage = String(errorDetail);
      } else {
        // Fallback al mensaje de error o el error completo
        errorMessage = String(err?.message || err || 'Error desconocido');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '24px auto', padding: 16 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Usuario</label>
          <input className="form-control rounded-input" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Contraseña</label>
          <input className="form-control rounded-input" value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%' }} />
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </div>
  );
}
