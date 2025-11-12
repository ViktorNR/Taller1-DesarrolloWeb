import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/api';

export default function Register({ onRegistered }: { onRegistered?: (creds: { username: string; password: string }) => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !username || !password) {
      setError('Email, username y contraseña son requeridos');
      return;
    }

    setLoading(true);
    try {
      const payload = { email, username, nombre, apellido, password };
      await registerUser(payload);
      // Si se proporciona callback, enviar credenciales para permitir auto-login
      if (onRegistered) {
        onRegistered({ username, password });
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '24px auto', padding: 16 }}>
      <h2>Registro</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input className="form-control rounded-input" value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Usuario (username)</label>
          <input className="form-control rounded-input" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Nombre</label>
            <input className="form-control rounded-input" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Apellido</label>
            <input className="form-control rounded-input" value={apellido} onChange={e => setApellido(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Contraseña</label>
          <input className="form-control rounded-input" value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%' }} />
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
      </form>
    </div>
  );
}
