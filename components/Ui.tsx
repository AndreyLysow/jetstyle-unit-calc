'use client';
import { ReactNode } from 'react';

export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <strong>{title}</strong>
          <button className="btn btn--ghost" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}