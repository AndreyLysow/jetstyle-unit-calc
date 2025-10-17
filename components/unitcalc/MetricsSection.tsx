'use client';

import { useEffect, useRef, useState } from 'react';
import s from '../../styles/metrics.module.scss';

type Props = {
  showMore: boolean;
  toggle: () => void;
  // пусть форматтер спокойно принимает undefined
  fmtR: (n?: number) => string;
  // значения могут прилетать не только числами
  data: Record<string, any>;
};

export default function MetricsSection({ showMore, toggle, data, fmtR }: Props) {
  const [maxH, setMaxH] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  // корректная высота, чтобы ничего не обрезалось
  useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current;
    const measure = () => setMaxH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data, showMore]);

  // ===== безопасные помощники
  const num  = (v: any, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const f2   = (v: any) => num(v).toFixed(2);
  const int  = (v: any) => Math.round(num(v));
  const intl = (v: any) => int(v).toLocaleString('ru-RU');

  const m = [
    ['Пороговый CPC',           f2(data.thrCpc)],
    ['Пороговый CPA',           f2(data.thrCpa)],
    ['ARPPU',                   fmtR(num(data.arppu))],
    ['ARPU',                    fmtR(num(data.arpu))],
    ['CPA',                     f2(data.cpa)],
    ['CPPU',                    f2(data.cppu)],
    ['Leads',                   intl(data.leads)],
    ['Buyers',                  intl(data.buyers)],
    ['Budget',                  fmtR(num(data.adSpend))],
    ['Gross Profit',            fmtR(num(data.grossProfit))],
    ['Revenue (без COGS)',      fmtR(num(data.revenue))],
    ['Operating Profit',        fmtR(num(data.opProfit))],
    ['Margin',                  fmtR(num(data.margin))],
    ['LTV',                     fmtR(num(data.ltv))],
    ['PPPU',                    fmtR(num(data.pppu))],
    ['Retention (APC)',         f2(data.ret)],        // больше не падает
    ['Average Order',           fmtR(num(data.avgOrder))],
  ] as const;

  return (
    <section className={s.wrap}>
      <button
        type="button"
        className={s.headerBtn}
        onClick={toggle}
        aria-expanded={showMore}
        aria-controls="metrics-extra"
      >
        <span className={`${s.chevWrap} ${showMore ? s.up : ''}`}>
          <span className={s.chev} aria-hidden />
        </span>
        <span className={s.headerText}>Остальные метрики</span>
      </button>

      <div
        id="metrics-extra"
        className={`${s.collapse} ${showMore ? s.open : s.closed}`}
        style={{ maxHeight: showMore ? maxH : 0 }}
      >
        <div ref={bodyRef} className={s.inner}>
          <div className={s.grid}>
            {m.map(([label, value]) => (
              <div key={label} className={s.row}>
                <span className={s.label}>{label}</span>
                <b className={s.val}>{value}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}