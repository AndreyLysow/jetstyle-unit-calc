'use client';
import { useEffect, useRef, useState } from 'react';
import t from '../styles/tooltip.module.scss';

export default function Tooltip({
  anchor,
  title,
  children,
  placement = 'bottom',
  maxWidth = 420,
}: {
  anchor: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom';
  maxWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDoc = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className={t.wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        className={t.trigger}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(v => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
      >
        {anchor}
      </span>

      {open && (
        <div
          className={`${t.pop} ${placement === 'top' ? t.top : t.bottom}`}
          style={{ maxWidth }}
          role="tooltip"
        >
          {title && <div className={t.title}>{title}</div>}
          {children && <div className={t.body}>{children}</div>}
        </div>
      )}
    </span>
  );
}