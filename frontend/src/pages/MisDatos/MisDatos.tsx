import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function MisDatos() {
  const { user, updateUser } = useAuth() as any;
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', rut: '' });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({ nombre: user.nombre ?? '', apellido: user.apellido ?? '', email: user.email ?? '', rut: user.rut ?? '' });
    }
  }, [user]);

  async function onSave() {
    if (!updateUser) return;
    setLoading(true);
    setMessage(null);
    try {
      const updated = await updateUser({ nombre: form.nombre, apellido: form.apellido, email: form.email, rut: form.rut });
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
          <input className="form-control" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!editable} />
        </div>
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input className="form-control" value={form.rut} onChange={e => setForm(f => ({ ...f, rut: e.target.value }))} disabled={!editable} placeholder="12.345.678-9" />
        </div>

        <div className="d-flex gap-2">
          {!editable ? (
            <button className="btn btn-primary" onClick={() => setEditable(true)}>Editar</button>
          ) : (
            <>
              <button className="btn btn-confirmar" onClick={onSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
              <button className="btn btn-outline-primary" onClick={() => { setEditable(false); setForm({ nombre: user.nombre ?? '', apellido: user.apellido ?? '', email: user.email ?? '', rut: user.rut ?? '' }); }}>Cancelar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
