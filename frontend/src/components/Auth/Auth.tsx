import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  // Determine where to go after successful auth (default '/').
  const backTo = (location.state as any)?.from ?? '/';
  const backState = { openCheckout: (location.state as any)?.openCheckout };

  // Called when register completes; attempt auto-login with provided creds
  const handleRegistered = async (creds: { username: string; password: string }) => {
    try {
      await login(creds.username, creds.password);
      navigate(backTo, { state: backState });
    } catch (e) {
      // If auto-login fails, switch to login mode and let user try
      setMode('login');
    }
  };

  const handleLoginSuccess = () => {
    navigate(backTo, { state: backState });
  };

  return (
    <div style={{ maxWidth: 600, margin: '24px auto', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode('login')} className={mode === 'login' ? 'btn btn-primary' : 'btn btn-outline-primary'}>Iniciar sesión</button>
        <button onClick={() => setMode('register')} className={mode === 'register' ? 'btn btn-primary' : 'btn btn-outline-primary'}>Registrarse</button>
      </div>

      <div>
        {mode === 'login' ? (
          <Login onSuccess={handleLoginSuccess} />
        ) : (
          <Register onRegistered={handleRegistered} />
        )}
      </div>
    </div>
  );
}
