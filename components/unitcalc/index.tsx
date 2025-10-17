'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/unitcalc.module.scss';
import FormulaCard from './FormulaCard';
import MetricsSection from './MetricsSection';
import type { CalcDoc } from '@/server/models/Calc';

type Inputs = {
  cpc: number;
  cr1: number;
  cr2: number;
  avp: number;
  cogs: number;
  ret: number;
  au: number;
};

const DEFAULT_INPUTS: Inputs = {
  cpc: 14, cr1: 2.43, cr2: 53, avp: 1050, cogs: 250, ret: 1.9, au: 10000,
};

const fmtMoney = (n?: number) =>
  Number(n).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 });
const fmt2 = (n?: number) =>
  Number(n ?? 0).toLocaleString('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

const safeDiv = (num: number, den: number) => (den ? num / den : 0);

export default function UnitCalc() {
  const [title, setTitle] = useState('Новый расчёт');
  const [showMore, setShowMore] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaved, setShowSaved] = useState(true);
  const [v, setV] = useState<Inputs>(DEFAULT_INPUTS);

  const onNum = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = String(e.target.value).replace(',', '.');
    const val = Number(raw);
    setV(p => ({ ...p, [k]: Number.isFinite(val) ? val : 0 }));
  };

  /* ===== вычисления ===== */
  const leads       = useMemo(() => Math.round(safeDiv(v.au * v.cr1, 100)), [v.au, v.cr1]);
  const buyers      = useMemo(() => Math.round(safeDiv(leads * v.cr2, 100)), [leads, v.cr2]);
  const margin      = useMemo(() => v.avp - v.cogs, [v.avp, v.cogs]);
  const ltv         = useMemo(() => margin * v.ret, [margin, v.ret]);
  const cpa         = useMemo(() => safeDiv(v.cpc, v.cr1 / 100), [v.cpc, v.cr1]);
  const cppu        = useMemo(() => safeDiv(cpa, v.cr2 / 100), [cpa, v.cr2]);
  const pppu        = useMemo(() => ltv - cppu, [ltv, cppu]);
  const adSpend     = useMemo(() => v.au * v.cpc, [v.au, v.cpc]);
  const revenue     = useMemo(() => buyers * v.avp * v.ret, [buyers, v.avp, v.ret]);
  const grossProfit = useMemo(() => buyers * margin * v.ret, [buyers, margin, v.ret]);
  const opProfit    = useMemo(() => grossProfit - adSpend, [grossProfit, adSpend]);
  const thrCpc      = useMemo(() => safeDiv(grossProfit, v.au), [grossProfit, v.au]);
  const thrCpa      = useMemo(() => safeDiv(adSpend, buyers || 1), [adSpend, buyers]);
  const arppu       = useMemo(() => v.avp * v.ret, [v.avp, v.ret]);
  const arpu        = useMemo(() => safeDiv(buyers * v.avp * v.ret, v.au), [buyers, v.avp, v.ret, v.au]);

  const metricsData = {
    thrCpc, thrCpa, arppu, arpu, cpa, cppu, leads, buyers,
    adSpend, grossProfit, revenue, opProfit, margin, ltv, pppu,
    ret: v.ret, avgOrder: v.avp,
  };

  /* ===== CRUD ===== */
  const [items, setItems] = useState<CalcDoc[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/calcs', { cache: 'no-store' });
      setItems(res.ok ? await res.json() : []);
    })();
  }, []);

  const buildPayload = (t: string) => ({
    title: t, ...v,
    margin, ltv, cppu, pppu, leads, buyers, adSpend, revenue, grossProfit, opProfit,
  });

  const saveNew = async () => {
    const res = await fetch('/api/calcs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(title)),
    });
    if (!res.ok) return;
    const created: CalcDoc = await res.json();
    setItems(p => [...p, created]);
    setCurrentId(created._id);
    setIsEditing(false);
  };

  const saveChanges = async () => {
    if (!currentId) return;
    const res = await fetch(`/api/calcs/${currentId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(title)),
    });
    if (!res.ok) return;
    const updated: CalcDoc = await res.json();
    setItems(prev => prev.map(i => (i._id === updated._id ? updated : i)));
    setIsEditing(false);
  };

  const duplicate = async () => {
    const dupTitle = title.trim() ? `${title} (копия)` : 'Расчёт (копия)';
    const res = await fetch('/api/calcs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(dupTitle)),
    });
    if (!res.ok) return;
    const created: CalcDoc = await res.json();
    setItems(p => [...p, created]);
    setCurrentId(created._id);
    setTitle(dupTitle);
  };

  const removeCurrent = async () => {
    if (!currentId) return;
    const res = await fetch(`/api/calcs/${currentId}`, { method: 'DELETE' });
    if (!res.ok) return;
    setItems(prev => prev.filter(i => i._id !== currentId));
    setCurrentId(null);
    setIsEditing(false);
  };

  const startNew = () => {
    setV(DEFAULT_INPUTS);
    setTitle('Новый расчёт');
    setCurrentId(null);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ===== Render ===== */
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        {/* Шапка */}
        <div className={styles.headerBar}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
            placeholder="Введите название расчёта"
          />
          <div className={styles.headerActions}>
            {isEditing ? (
              <>
                <button className={styles.iconBtn} onClick={saveChanges} title="Сохранить изменения">💾</button>
                <button className={styles.iconBtn} onClick={() => { setIsEditing(false); setCurrentId(null); }} title="Отмена">↩︎</button>
                <button className={styles.iconBtn} onClick={removeCurrent} title="Удалить">🗑</button>
              </>
            ) : (
              <>
                <button className={styles.iconBtn} onClick={saveNew} title="Сохранить">💾</button>
                <button className={styles.iconBtn} onClick={duplicate} title="Дублировать">⎘</button>
                <button className={styles.iconBtn} onClick={removeCurrent} title="Удалить">🗑</button>
              </>
            )}
          </div>
        </div>

        {/* Формула */}
        <FormulaCard
          v={v}
          onChange={onNum}
          margin={margin}
          ltv={ltv}
          cppu={cppu}
          pppu={pppu}
          fmtR={fmtMoney}
        />

        {/* Итого */}
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого:</span>
          <span className={styles.totalValue}>{fmtMoney(opProfit)}</span>
        </div>

        {/* Остальные метрики */}
        <MetricsSection
          showMore={showMore}
          toggle={() => setShowMore(s => !s)}
          fmtR={fmtMoney}
          data={metricsData}
        />

        {/* Сохранённые */}
        {items.length > 0 && showSaved && (
          <div className={styles.savedBlock}>
            <div className={styles.savedTitle}>Сохранённые расчёты</div>
            <ul className={styles.cardList}>
              {items.map(it => (
                <li key={it._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{it.title}</div>
                    <button
                      className={styles.editLink}
                      onClick={() => {
                        setCurrentId(it._id);
                        setTitle(it.title);
                        setV({ cpc: it.cpc, cr1: it.cr1, cr2: it.cr2, avp: it.avp, cogs: it.cogs, ret: it.ret, au: it.au });
                        setIsEditing(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      ✎ Редактировать
                    </button>
                  </div>

                  <div className={styles.cardFormula}>
                    <span className={styles.fMinus}>–</span>
                    <span>(</span>
                    <b>{fmt2(it.cpc)}</b>
                    <span> / </span>
                    <b>{fmt2(it.cr1)}</b>
                    <span> / </span>
                    <b>{fmt2(it.cr2)}</b>
                    <span>) + (</span>
                    <b>{fmtMoney(it.avp)}</b>
                    <span> – </span>
                    <b>{fmtMoney(it.cogs)}</b>
                    <span>) × </span>
                    <b>{fmt2(it.ret)}</b>
                    <span className={styles.eq}>=</span>
                    <b className={styles.pppuValue}>{fmtMoney(it.pppu)}</b>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Низ: слева ссылка, справа — «Новый расчёт» */}
        <div className={styles.controlsRow}>
          {items.length > 0 && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => setShowSaved(s => !s)}
            >
              {showSaved ? 'Скрыть сохранённые расчёты' : 'Показать сохранённые расчёты'}
            </button>
          )}

          <button className={styles.btnNew} onClick={startNew}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
            </svg>
            Новый расчёт
          </button>
        </div>
      </div>
    </div>
  );
}