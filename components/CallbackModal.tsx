'use client';
import { useState } from 'react';
import { Modal, Field } from './Ui';
import { postCallback } from '../lib/api';

export default function CallbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Хочу обсудить проект.');
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await postCallback({ name, email, message });
    setOk(true);
  }

  return (
    <Modal title="Обратная связь" onClose={onClose}>
      {ok ? (
        <p>Спасибо! Мы свяжемся с вами по адресу {email}.</p>
      ) : (
        <form onSubmit={submit}>
          <Field label="Имя">
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
          </Field>
          <div style={{ height: 8 }} />
          <Field label="E-mail">
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Field>
          <div style={{ height: 8 }} />
          <Field label="Сообщение">
            <textarea className="input" rows={4} value={message}
              onChange={e => setMessage(e.target.value)} />
          </Field>
          <div style={{ height: 12 }} />
          <button className="btn">Отправить</button>
        </form>
      )}
    </Modal>
  );
}