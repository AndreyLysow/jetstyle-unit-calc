'use client';

import { useMemo, useState } from 'react';
import s from '@/styles/compare.module.scss';
import type { CalcDoc } from '@/server/models/Calc';
import DownloadModal from './DownloadModal';

type Props = { items: CalcDoc[] };

// форматтеры
const fmtR = (n?: number) =>
  Number(n ?? 0).toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  });

const f2 = (n?: number) =>
  Number(n ?? 0).toLocaleString('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

const safeDiv = (num: number, den: number) => (den ? num / den : 0);

export default function CompareResults({ items }: Props) {
  const [open, setOpen] = useState(false);

  // нормализуем строки таблицы из сохранённых расчётов
  const rows = useMemo(() => {
    if (!items?.length) return [];

    return items.map((it) => {
      const leads  = Math.round((it.au * it.cr1) / 100);
      const buyers = Math.round((leads * it.cr2) / 100);
      const margin = it.avp - it.cogs;
      const ltv    = margin * it.ret;
      const cpa    = safeDiv(it.cpc, it.cr1 / 100);
      const cppu   = safeDiv(cpa, it.cr2 / 100);
      const pppu   = ltv - cppu;
      const ad     = it.adSpend ?? it.au * it.cpc;
      const gpf    = it.grossProfit ?? buyers * margin * it.ret;
      const rev    = it.revenue ?? buyers * it.avp * it.ret;
      const thrCpc = safeDiv(gpf, it.au);
      const thrCpa = safeDiv(ad, buyers || 1);

      return {
        id: it._id,
        title: it.title || 'Без названия',
        thrCpc,
        thrCpa,
        cpa,
        revenue: rev,
        grossProfit: gpf,
        pppu,
      };
    });
  }, [items]);

  if (!rows.length) return null;

  // ==== действия ====
  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Unit-Calc — сравнение', url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Ссылка скопирована в буфер обмена');
      } else {
        const inp = document.createElement('input');
        inp.value = url;
        document.body.appendChild(inp);
        inp.select();
        document.execCommand('copy');
        inp.remove();
        alert('Ссылка скопирована в буфер обмена');
      }
    } catch {
      /* no-op */
    }
  };

  return (
    <section className={s.wrap}>
      <h3 className={s.h}>Сравнение результатов</h3>

      <div className={s.table} role="table" aria-label="Сравнение результатов">
        <div className={`${s.tr} ${s.th}`} role="row">
          <div className={`${s.td} ${s.colTitle}`}>Расчёты</div>
          <div className={s.td}>Пороговый CPC, ₽</div>
          <div className={s.td}>Пороговый CPA, ₽</div>
          <div className={s.td}>CPA, ₽</div>
          <div className={s.td}>Revenue, ₽</div>
          <div className={s.td}>Gross Profit, ₽</div>
          <div className={`${s.td} ${s.colStrong}`}>PPPU, ₽</div>
        </div>

        {rows.map((r) => (
          <div key={r.id} className={s.tr} role="row">
            <div className={`${s.td} ${s.colTitle}`} title={r.title}>
              {r.title}
            </div>
            <div className={s.td}>{f2(r.thrCpc)}</div>
            <div className={s.td}>{f2(r.thrCpa)}</div>
            <div className={s.td}>{f2(r.cpa)}</div>
            <div className={s.td}>{fmtR(r.revenue)}</div>
            <div className={s.td}>{fmtR(r.grossProfit)}</div>
            <div
              className={`${s.td} ${s.colStrong} ${r.pppu >= 0 ? s.pos : s.neg}`}
            >
              {fmtR(r.pppu)}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопки: слева Share (ghost), справа Скачать (primary -> модалка) */}
      <div className={s.actions}>
        <div className={s.groupLeft}>
          <button type="button" className={s.btnGhost} onClick={onShare}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 0 6c.37 0 .73-.07 1.06-.2l-6.28 3.14A3 3 0 0 0 6 12a3 3 0 1 0 2.78 4.02l6.28 3.14A3 3 0 1 0 18 16a2.99 2.99 0 0 0-2.06.8l-6.28-3.14A2.98 2.98 0 0 0 9 12c0-.25-.03-.49-.09-.72l6.28-3.14C15.64 8.37 16.79 9 18 9Z" />
            </svg>
            Поделиться
          </button>
        </div>

        <div className={s.groupRight}>
          <button
            type="button"
            className={s.btnPrimary}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v10.17l3.59-3.58L17 11l-5 5-5-5 1.41-1.41L11 13.17V3h1Zm-7 16h14v2H5v-2Z" />
            </svg>
            Скачать
          </button>
        </div>
      </div>

      {/* Модалка скачивания (email -> /api/export-xsl -> внешний API) */}
      <DownloadModal open={open} onClose={() => setOpen(false)} rows={rows} />
    </section>
  );
}