'use client';

import React from 'react';
import Image from 'next/image';
import s from '../styles/FooterPromo.module.scss';

const MAX_FILE_MB = 12; // лимит вложения (подходит под большинство SMTP)
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

function formatBytes(n: number) {
  if (!n && n !== 0) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i ? 1 : 0)} ${u[i]}`;
}

export default function BottomLead() {
  // subscribe
  const [subEmail, setSubEmail] = React.useState('');
  const [subSending, setSubSending] = React.useState(false);

  // lead
  const leadFormRef = React.useRef<HTMLFormElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [sending, setSending] = React.useState(false);

  // UX
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  // ───────────── Подписка ─────────────
  const onSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setSubSending(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Subscribe failed');
      setMsg('Спасибо! Вы подписаны.');
      setSubEmail('');
    } catch (e: any) {
      setErr(`Ошибка подписки: ${e.message || e}`);
    } finally {
      setSubSending(false);
    }
  };

  // ───────────── Заявка ─────────────
  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr(null);
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setFile(null);
      // сбросим инпут, чтобы можно было выбрать тот же файл снова
      if (fileInputRef.current) fileInputRef.current.value = '';
      setErr(`Файл слишком большой (${formatBytes(f.size)}). Лимит — ${MAX_FILE_MB} MB.`);
      return;
    }
    setFile(f);
  };

  const onLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setSending(true);
    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);

      // лёгкая валидация контакта
      const contact = String(fd.get('contact') || '').trim();
      const looksLikeEmail = /\S+@\S+\.\S+/.test(contact);
      const looksLikePhone = /[\d()+\-.\s]{5,}/.test(contact);
      if (!looksLikeEmail && !looksLikePhone) {
        throw new Error('Укажите корректный email или телефон');
      }

      // файл
      if (file) fd.set('file', file);

      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Send failed');

      setMsg('Отправлено! Мы свяжемся с вами.');
      // безопасный сброс формы
      leadFormRef.current?.reset();
      setFile(null);
      // подчистим инпут файла
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: any) {
      setErr(`Ошибка отправки: ${e.message || e}`);
    } finally {
      setSending(false);
    }
  };

  const onFileButtonClick = () => {
    setErr(null);
    fileInputRef.current?.click();
  };

  return (
    <section className={s.wrap} aria-label="Подписка и форма обратной связи">
      {/* ── Полоса подписки ───────────────────────────────────────────── */}
      <div className={s.subscribeBar}>
        <div className={s.subInner}>
          <span className={s.subText}>
            Подпишитесь, чтобы получать наши последние новости
          </span>

          <form className={s.subForm} onSubmit={onSubscribe}>
            <label className={s.visuallyHidden} htmlFor="subEmail">
              Email
            </label>
            <input
              id="subEmail"
              type="email"
              className={s.subInput}
              placeholder="Email"
              autoComplete="email"
              required
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              disabled={subSending}
            />
            <button className={s.subBtn} aria-label="Подписаться" type="submit" disabled={subSending}>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path d="M3 10h12M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* ── Нижняя зона: логотип + карточка формы ─────────────────────── */}
      <div className={s.grid}>
        <div className={s.logoCol}>
          <Image
            src="/logo.png"
            alt="JetStyle"
            width={184}
            height={138}
            priority
            className={s.logo}
          />
        </div>

        <form ref={leadFormRef} className={s.card} role="form" aria-labelledby="leadTitle" onSubmit={onLeadSubmit}>
          <div className={s.cardInner}>
            <div id="leadTitle" className={s.cardTitle}>
              <div>Привет JetStyle,</div>
              <div>Я бы хотел обсудить с вами проект.</div>
            </div>

            <div className={s.row2}>
              <label className={s.field}>
                <span className={s.label}>Пожалуйста, представьтесь*</span>
                <input className={s.input} type="text" name="name" required autoComplete="name" />
              </label>

              <label className={s.field}>
                <span className={s.label}>Email или Телефон*</span>
                <input className={s.input} type="text" name="contact" required autoComplete="email" />
              </label>
            </div>

            <label className={s.field}>
              <span className={s.label}>Комментарий</span>
              <textarea className={s.textarea} name="comment" />
            </label>

            {/* Кнопка выбора файла */}
            <button type="button" className={s.fileBtn} onClick={onFileButtonClick}>
              <span className={s.fileIcon} aria-hidden="true">📎</span>
              {file ? (
                <>
                  {file.name} • {formatBytes(file.size)}
                </>
              ) : (
                <>Добавить файл</>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              onChange={onFilePick}
              hidden
            />

            <div className={s.actions}>
              <button className={s.primary} type="submit" disabled={sending}>
                {sending ? 'Отправляю…' : 'Отправить'}
              </button>
              <a
                className={s.ghost}
                href="https://t.me/jetstyle" /* ← замени на свой username */
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать в Telegram
              </a>
            </div>

            {msg && <p className={s.note} role="status">✅ {msg}</p>}
            {err && <p className={s.note} role="alert" style={{ color: '#e81c2e' }}>Ошибка: {err}</p>}

            <p className={s.note}>
              Нажимая кнопку, я даю согласие на обработку персональных данных
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}