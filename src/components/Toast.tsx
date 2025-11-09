import React from 'react';
import { useUI } from '../context/UIContext';

export default function Toast() {
  const { mensaje, tipo } = useUI();
  if (!mensaje) return null;

  return (
    <div className={`toast-container show`} data-tipo={tipo} style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
      <div className="toast">
        <div className="toast-body">{mensaje}</div>
      </div>
    </div>
  );
}
