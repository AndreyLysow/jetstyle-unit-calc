'use client';

import { useEffect, useRef, useState } from 'react';
import s from '../../styles/downloadModal.module.scss';

type Row = {
  title: string;
  thrCpc: number;
  thrCpa: number;
  cpa: number;
  revenue: number;
  grossProfit: number;
  pppu: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  rows: Row[];            // нормализованные строки сравнения
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DownloadModal({ open, onClose, rows }: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setErr(null);
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!emailRe.test(email.trim())) {
      setErr('Введите корректный email');
      return;
    }

    try {
      setBusy(true);
      const res = await fetch('/api/export-xsl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), rows }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'Не удалось отправить файл');
      }
      setBusy(false);
      onClose();   // закрываем по успеху
    } catch (e: any) {
      setBusy(false);
      setErr(e?.message ?? 'Ошибка сети');
    }
  };

  if (!open) return null;

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div
        className={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dl-title"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <h3 id="dl-title" className={s.title}>Скачивание расчёта</h3>
        <p className={s.subtitle}>
          Напишите свой email.<br />Мы отправим вам xsl-файл с расчётами
        </p>

        <form onSubmit={onSubmit} className={s.form}>
          <label className={s.label}>
            Email<span className={s.req}>*</span>
          </label>
          <input
            ref={inputRef}
            type="email"
            className={s.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.ru"
            required
          />

            {err && <div className={s.error}>{err}</div>}

          <button type="submit" className={s.submit} disabled={busy}>
            {busy ? 'Отправляем…' : 'Отправить'}
          </button>
        </form>

        <p className={s.note}>
          Нажимая кнопку, я даю согласие на{' '}
          <a href="/privacy" target="_blank" rel="noreferrer">обработку персональных данных</a>
        </p>

        <button aria-label="Закрыть" className={s.close} onClick={onClose}>×</button>
      </div>
    </div>
  );
}