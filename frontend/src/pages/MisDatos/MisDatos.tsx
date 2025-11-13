import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type FormState = { nombre: string; apellido: string; email: string; rut: string; telefono: string };
type ErrorsState = { email?: string | null; rut?: string | null; telefono?: string | null };

export default function MisDatos() {
  const { user, updateUser } = useAuth() as any;
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ nombre: '', apellido: '', email: '', rut: '', telefono: '' });
  const [errors, setErrors] = useState<ErrorsState>({ email: null, rut: null, telefono: null });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre ?? '',
        apellido: user.apellido ?? '',
        email: user.email ?? '',
        rut: formatRut(user.rut ?? ''),
        telefono: user.telefono ?? ''
      });
      // validate initial values
      setErrors({
        email: validateEmail(user.email ?? '') ? null : 'Email inválido',
        rut: validateRut(user.rut ?? '') ? null : 'RUT inválido',
        telefono: validateTelefono(user.telefono ?? '') ? null : 'Teléfono inválido (ej: +56912345678)'
      });
    }
  }, [user]);

  function validateEmail(value: string) {
    if (!value) return false;
    // simple but effective email regex
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
    // if only one char typed, return as-is (partial input)
    if (cleaned.length === 1) return cleaned;
    const dv = cleaned.slice(-1);
    const num = cleaned.slice(0, -1);
    const numFormatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${numFormatted}-${dv}`;
  }

  function validateTelefono(value: string) {
    if (!value) return false;
    // require +569 followed by exactly 8 digits
    const re = /^\+569\d{8}$/;
    return re.test(value);
  }

  function validateField(field: keyof FormState, value: string) {
    if (field === 'email') {
      setErrors(e => ({ ...e, email: validateEmail(value) ? null : 'Email inválido' }));
    }
    if (field === 'rut') {
      setErrors(e => ({ ...e, rut: validateRut(value) ? null : 'RUT inválido' }));
    }
    if (field === 'telefono') {
      setErrors(e => ({ ...e, telefono: validateTelefono(value) ? null : 'Teléfono inválido (ej: +56912345678)' }));
    }
  }

  async function onSave() {
    if (!updateUser) return;
    setMessage(null);
    // final validation before send
    const emailOk = validateEmail(form.email);
    const rutOk = validateRut(form.rut);
    const telOk = validateTelefono(form.telefono);
    setErrors({ email: emailOk ? null : 'Email inválido', rut: rutOk ? null : 'RUT inválido', telefono: telOk ? null : 'Teléfono inválido (ej: +56912345678)' });
    if (!emailOk || !rutOk || !telOk) return;

    setLoading(true);
    try {
      const updated = await updateUser({ nombre: form.nombre, apellido: form.apellido, email: form.email, rut: form.rut, telefono: form.telefono });
      setMessage('Datos actualizados correctamente');
      setEditable(false);
    } catch (e: any) {
      setMessage('Error actualizando datos');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return (
    <div className="container" style={{ padding: 24 }}>
      <h2>Mis Datos</h2>
      <div className="alert alert-warning">Debes iniciar sesión para ver tus datos.</div>
    </div>
  );

  const hasErrors = Boolean(errors.email || errors.rut || errors.telefono);

  return (
    <div className="container" style={{ padding: 24, maxWidth: 720 }}>
      <h2>Mis Datos</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card p-3">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} disabled={!editable} />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input className="form-control" value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} disabled={!editable} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); validateField('email', e.target.value); }}
            disabled={!editable}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input
            className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
            value={form.rut}
            onChange={e => { const formatted = formatRut(e.target.value); setForm(f => ({ ...f, rut: formatted })); validateField('rut', formatted); }}
            disabled={!editable}
            placeholder="12.345.678-9"
          />
          {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
            value={form.telefono}
            onChange={e => { setForm(f => ({ ...f, telefono: e.target.value })); validateField('telefono', e.target.value); }}
            disabled={!editable}
            placeholder="+56912345678"
          />
          {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
        </div>

        <div className="d-flex gap-2">
          {!editable ? (
            <button className="btn btn-primary" onClick={() => setEditable(true)}>Editar</button>
          ) : (
            <>
              <button className="btn btn-confirmar" onClick={onSave} disabled={loading || hasErrors}>{loading ? 'Guardando...' : 'Guardar'}</button>
              <button className="btn btn-outline-primary" onClick={() => { setEditable(false); setForm({ nombre: user.nombre ?? '', apellido: user.apellido ?? '', email: user.email ?? '', rut: formatRut(user.rut ?? ''), telefono: user.telefono ?? '' }); setErrors({ email: null, rut: null, telefono: null }); }}>Cancelar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
