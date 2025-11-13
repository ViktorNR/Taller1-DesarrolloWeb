import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/api';

type ErrorsState = { email?: string | null; rut?: string | null; telefono?: string | null };

export default function Register({ onRegistered }: { onRegistered?: (creds: { username: string; password: string }) => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRules, setPasswordRules] = useState({ length: false, upper: false, lower: false, number: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorsState>({ email: null, rut: null, telefono: null });
  const navigate = useNavigate();

  function validateEmail(value: string) {
    if (!value) return false;
    const re = /^[\w.!#$%&'*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;
    return re.test(value);
  }

  function cleanRut(value: string) {
    return value.replace(/[^0-9kK]/g, '').toUpperCase();
  }

  function validateRut(value: string) {
    if (!value) return false;
    const rut = cleanRut(value);
    if (rut.length < 2) return false;
    const dv = rut.slice(-1);
    const num = rut.slice(0, -1);
    let sum = 0;
    let mul = 2;
    for (let i = num.length - 1; i >= 0; i--) {
      sum += parseInt(num.charAt(i), 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    const res = 11 - (sum % 11);
    let dvExpected = '';
    if (res === 11) dvExpected = '0';
    else if (res === 10) dvExpected = 'K';
    else dvExpected = String(res);
    return dvExpected === dv;
  }

  function formatRut(value: string) {
    if (!value) return '';
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!cleaned) return '';
    if (cleaned.length === 1) return cleaned;
    const dv = cleaned.slice(-1);
    const num = cleaned.slice(0, -1);
    const numFormatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${numFormatted}-${dv}`;
  }

  function validateTelefono(value: string) {
    if (!value) return false;
    const re = /^\+569\d{8}$/;
    return re.test(value);
  }

  function validatePasswordRules(pw: string) {
    return {
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw)
    };
  }

  function validateField(field: 'email' | 'rut' | 'telefono', value: string) {
    if (field === 'email') setErrors(e => ({ ...e, email: validateEmail(value) ? null : 'Email inválido' }));
    if (field === 'rut') setErrors(e => ({ ...e, rut: validateRut(value) ? null : 'RUT inválido' }));
    if (field === 'telefono') setErrors(e => ({ ...e, telefono: validateTelefono(value) ? null : 'Teléfono inválido (ej: +56912345678)' }));
  }

  const hasErrors = Boolean(errors.email || errors.rut || errors.telefono);
  const passwordValid = Object.values(passwordRules).every(Boolean);
  const incomplete = !email || !username || !password || !telefono || !nombre || !apellido || !rut;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !username || !password) {
      setError('Email, username y contraseña son requeridos');
      return;
    }

    const pwRules = validatePasswordRules(password);
    setPasswordRules(pwRules);
    const pwOk = pwRules.length && pwRules.upper && pwRules.lower && pwRules.number;
    if (!pwOk) {
      setError('La contraseña no cumple los requisitos');
      return;
    }

    const emailOk = validateEmail(email);
    const rutOk = validateRut(rut);
    const telOk = telefono ? validateTelefono(telefono) : true;
    setErrors({ email: emailOk ? null : 'Email inválido', rut: rutOk ? null : 'RUT inválido', telefono: telOk ? null : 'Teléfono inválido (ej: +56912345678)' });
    if (!emailOk || !rutOk || !telOk) return;

    setLoading(true);
    try {
      const payload: any = { email, username, nombre, apellido, password };
      if (rut) payload.rut = cleanRut(rut);
      if (telefono) payload.telefono = telefono;
      await registerUser(payload);
      // Si se proporciona callback, enviar credenciales para permitir auto-login
      if (onRegistered) {
        onRegistered({ username, password });
      } else {
        navigate('/login');
      }
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
      <h2>Registro</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email <span className="text-danger">*</span></label>
          <input
            className={`form-control rounded-input ${errors.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={e => { setEmail(e.target.value); validateField('email', e.target.value); }}
            type="email"
            placeholder='mail@ejemplo.cl'
            required
            style={{ width: '100%' }}
          />
          {errors.email && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Usuario (username) <span className="text-danger">*</span></label>
          <input className="form-control rounded-input" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Nombre <span className="text-danger">*</span></label>
            <input className="form-control rounded-input" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Apellido <span className="text-danger">*</span></label>
            <input className="form-control rounded-input" value={apellido} onChange={e => setApellido(e.target.value)} required style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>RUT <span className="text-danger">*</span></label>
          <input
            className={`form-control rounded-input ${errors.rut ? 'is-invalid' : ''}`}
            value={rut}
            onChange={e => { const formatted = formatRut(e.target.value); setRut(formatted); validateField('rut', formatted); }}
            placeholder="12.345.678-9"
            required
            style={{ width: '100%' }}
          />
          {errors.rut && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.rut}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Teléfono <span className="text-danger">*</span></label>
          <input
            className={`form-control rounded-input ${errors.telefono ? 'is-invalid' : ''}`}
            value={telefono}
            onChange={e => { setTelefono(e.target.value); validateField('telefono', e.target.value); }}
            placeholder="+56912345678"
            required
            style={{ width: '100%' }}
          />
          {errors.telefono && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.telefono}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Contraseña <span className="text-danger">*</span></label>
          <div className={`input-group ${!passwordValid && password ? 'is-invalid' : ''}`}>
            <input
              className={`form-control rounded-input ${!passwordValid && password ? 'is-invalid' : ''}`}
              value={password}
              onChange={e => {
                const v = e.target.value;
                setPassword(v);
                setPasswordRules(validatePasswordRules(v));
              }}
              type={showPassword ? 'text' : 'password'}
              required
              aria-label="Contraseña"
              aria-describedby="password-toggle"
            />
            <span
              className="input-group-text password-toggle"
              id="password-toggle"
              onClick={() => setShowPassword(s => !s)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(s => !s); }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
              )}
            </span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13 }}>
            <div className={passwordRules.length ? 'text-success' : 'text-danger'}>• Mínimo 8 caracteres</div>
            <div className={passwordRules.upper ? 'text-success' : 'text-danger'}>• Al menos una mayúscula</div>
            <div className={passwordRules.lower ? 'text-success' : 'text-danger'}>• Al menos una minúscula</div>
            <div className={passwordRules.number ? 'text-success' : 'text-danger'}>• Al menos un número</div>
          </div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

  <button type="submit" className="btn btn-primary" disabled={loading || hasErrors || !passwordValid || incomplete}>{loading ? 'Registrando...' : 'Registrarse'}</button>
      </form>
    </div>
  );
}
