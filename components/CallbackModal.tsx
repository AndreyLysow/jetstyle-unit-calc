'use client';

import { useEffect, useRef, useState } from 'react';
import s from '../styles/callbackModal.module.scss';

type Props = { onClose: () => void };

const nameRe = /^.{2,}$/;
const contactRe = /^.{5,}$/;

export default function CallbackModal({ onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    setTimeout(() => nameRef.current?.focus(), 40);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const contact = String(fd.get('contact') || '').trim();
    if (!nameRe.test(name)) return setErr('Укажите имя (минимум 2 символа).');
    if (!contactRe.test(contact)) return setErr('Укажите контакт для связи.');

    try {
      setBusy(true);
      const res = await fetch('/api/callback', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'Не удалось отправить заявку');
      setOk(true);
      setBusy(false);
      setTimeout(onClose, 1400);
    } catch (e: any) {
      setBusy(false);
      setErr(e?.message ?? 'Ошибка сети');
    }
  }

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className={s.close} aria-label="Закрыть" onClick={onClose}>×</button>

        <h3 className={s.title}>Привет, JetStyle,</h3>
        <p className={s.subtitle}>Я бы хотел проконсультироваться с вами по аналитике.</p>

        <form className={s.form} onSubmit={onSubmit}>
          {/* первая строка двумя колонками */}
          <div className={s.row2}>
            <label className={s.label}>
              Пожалуйста, представьтесь*
              <input ref={nameRef} name="name" className={s.input} placeholder="Иван Иванов" required />
            </label>

            <label className={s.label}>
              Email или телефон*
              <input name="contact" className={s.input} placeholder="name@company.ru / +7 900 000-00-00" required />
            </label>
          </div>

          <label className={s.label}>
            Комментарии
            <textarea name="comment" className={`${s.input} ${s.textarea}`} placeholder="Коротко о задаче" />
          </label>

          {/* кнопка добавления файла на всю ширину строки */}
          <label className={s.fileBtn}>
            <input name="file" type="file" />
            <span className={s.paperclip}>📎</span>
            Добавить файл
          </label>

          {err && <div className={s.error}>{err}</div>}
          {ok && <div className={s.ok}>Заявка отправлена, спасибо!</div>}

          <div className={s.btnRow}>
            <button type="submit" className={s.btnPrimary} disabled={busy}>
              {busy ? 'Отправляем…' : 'Отправить'}
            </button>

            <a className={s.btnGhost} href="https://t.me/jetstyle" target="_blank" rel="noreferrer">
              Написать в Telegram
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor"
                  d="M9.6 16.8l.2-3.9 7.2-6.5c.3-.3-.1-.5-.6-.3L7.5 11.5 4.1 10.4c-.8-.3-.8-1.2.1-1.6l15-5.8c.7-.3 1.4.2 1.2 1.3l-2.6 12.1c-.2.8-.7 1-1.4.6l-4-2.9-1.9 1.8c-.2.2-.4.4-.9.4z" />
              </svg>
            </a>
          </div>

          <p className={s.note}>
            Нажимая кнопку, я даю согласие на{' '}
            <a href="/privacy" target="_blank" rel="noreferrer">обработку персональных данных</a>
          </p>
        </form>
      </div>
    </div>
  );
}