'use client';
import { useState } from 'react';
import { Modal, Field } from './Ui';
import { postLead } from '../lib/api';

export default function EmailDownloadModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await postLead({ email });
      setOk(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Получить расчёты на e-mail" onClose={onClose}>
      {ok ? (
        <p>Спасибо! Мы отправим результаты на {email}.</p>
      ) : (
        <form onSubmit={submit}>
          <Field label="E-mail">
            <input className="input" type="email" required value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </Field>
          <div style={{ height: 12 }} />
          <button className="btn" disabled={loading}>{loading ? 'Отправка…' : 'Отправить'}</button>
        </form>
      )}
    </Modal>
  );
}