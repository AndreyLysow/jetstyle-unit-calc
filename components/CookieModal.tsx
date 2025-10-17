'use client';

import { useEffect, useState } from 'react';
import s from '@/styles/cookie-bar.module.scss';

const KEY = 'cookie-consent:v1';

export default function CookieModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className={s.bar} role="region" aria-label="Уведомление о cookies">
      <p className={s.text}>
        На этом сайте мы используем cookies
      </p>
      <button className={s.btn} type="button" onClick={accept}>Хорошо</button>
    </div>
  );
}