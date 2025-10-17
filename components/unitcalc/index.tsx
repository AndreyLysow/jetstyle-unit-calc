'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/UnitCalc.module.scss';
import FormulaCard from './FormulaCard';
import MetricsSection from './MetricsSection';
import CompareResults from './CompareResults';
import type { CalcDoc } from '../../server/models/Calc';

/** Входные параметры формулы */
type CalculationInputs = {
  cpc: number;   // Cost Per Click
  cr1: number;   // Conversion Rate 1
  cr2: number;   // Conversion Rate 2
  avp: number;   // Average Purchase
  cogs: number;  // Cost of Goods Sold
  ret: number;   // Retention (количество покупок на клиента)
  au: number;    // Acquired Users
};

type UnitCalcProps = {
  onDownload?: () => void; // опциональный коллбек для открытия модалки
};

const DEFAULT_CALC_INPUTS: CalculationInputs = {
  cpc: 14,
  cr1: 2.43,
  cr2: 53,
  avp: 1050,
  cogs: 250,
  ret: 1.9,
  au: 10000,
};

/** Форматирование денег */
const formatMoney = (value?: number) =>
  Number(value).toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  });

/** Форматирование до 2 знаков */
const format2 = (value?: number) =>
  Number(value ?? 0).toLocaleString('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

/** Безопасное деление (деление на 0 -> 0) */
const safeDivide = (numerator: number, denominator: number) =>
  denominator ? numerator / denominator : 0;

export default function UnitCalc({ onDownload }: UnitCalcProps) {
  // UI-состояние
  const [calcTitle, setCalcTitle] = useState('Новый расчёт');
  const [isMoreMetricsOpen, setIsMoreMetricsOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSavedVisible, setIsSavedVisible] = useState(true);

  // Значения инпутов формулы
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_CALC_INPUTS);

  /** Обработчик числовых полей */
  const handleNumberChange =
    (key: keyof CalculationInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const normalized = String(e.target.value).replace(',', '.');
      const numeric = Number(normalized);
      setInputs((prev) => ({ ...prev, [key]: Number.isFinite(numeric) ? numeric : 0 }));
    };

  /* ================== ВЫЧИСЛЕНИЯ ================== */
  const leads = useMemo(
    () => Math.round(safeDivide(inputs.au * inputs.cr1, 100)),
    [inputs.au, inputs.cr1],
  );

  const buyers = useMemo(
    () => Math.round(safeDivide(leads * inputs.cr2, 100)),
    [leads, inputs.cr2],
  );

  const unitMargin = useMemo(
    () => inputs.avp - inputs.cogs,
    [inputs.avp, inputs.cogs],
  );

  const ltv = useMemo(() => unitMargin * inputs.ret, [unitMargin, inputs.ret]);

  const cpa = useMemo(
    () => safeDivide(inputs.cpc, inputs.cr1 / 100),
    [inputs.cpc, inputs.cr1],
  );

  const cppu = useMemo(() => safeDivide(cpa, inputs.cr2 / 100), [cpa, inputs.cr2]);

  const pppu = useMemo(() => ltv - cppu, [ltv, cppu]);

  const adSpend = useMemo(() => inputs.au * inputs.cpc, [inputs.au, inputs.cpc]);

  const revenue = useMemo(
    () => buyers * inputs.avp * inputs.ret,
    [buyers, inputs.avp, inputs.ret],
  );

  const grossProfit = useMemo(
    () => buyers * unitMargin * inputs.ret,
    [buyers, unitMargin, inputs.ret],
  );

  const operatingProfit = useMemo(
    () => grossProfit - adSpend,
    [grossProfit, adSpend],
  );

  const thresholdCpc = useMemo(
    () => safeDivide(grossProfit, inputs.au),
    [grossProfit, inputs.au],
  );

  const thresholdCpa = useMemo(
    () => safeDivide(adSpend, buyers || 1),
    [adSpend, buyers],
  );

  const arppu = useMemo(() => inputs.avp * inputs.ret, [inputs.avp, inputs.ret]);

  const arpu = useMemo(
    () => safeDivide(buyers * inputs.avp * inputs.ret, inputs.au),
    [buyers, inputs.avp, inputs.ret, inputs.au],
  );

  const metricsForTable = {
    thrCpc: thresholdCpc,
    thrCpa: thresholdCpa,
    arppu,
    arpu,
    cpa,
    cppu,
    leads,
    buyers,
    adSpend,
    grossProfit,
    revenue,
    opProfit: operatingProfit,
    margin: unitMargin,
    ltv,
    pppu,
    ret: inputs.ret,
    avgOrder: inputs.avp,
  };

  /* ================== CRUD ДЛЯ СОХРАНЕНИЙ ================== */
  const [savedCalcs, setSavedCalcs] = useState<CalcDoc[]>([]);
  const [currentCalcId, setCurrentCalcId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/calcs', { cache: 'no-store' });
      setSavedCalcs(res.ok ? await res.json() : []);
    })();
  }, []);

  const buildPayload = (title: string) => ({
    title,
    ...inputs,
    margin: unitMargin,
    ltv,
    cppu,
    pppu,
    leads,
    buyers,
    adSpend,
    revenue,
    grossProfit,
    opProfit: operatingProfit,
  });

  const createNewCalc = async () => {
    const res = await fetch('/api/calcs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(calcTitle)),
    });
    if (!res.ok) return;
    const created: CalcDoc = await res.json();
    setSavedCalcs((prev) => [...prev, created]);
    setCurrentCalcId(created._id);
    setIsEditMode(false);
  };

  const saveExistingCalc = async () => {
    if (!currentCalcId) return;
    const res = await fetch(`/api/calcs/${currentCalcId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(calcTitle)),
    });
    if (!res.ok) return;
    const updated: CalcDoc = await res.json();
    setSavedCalcs((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    setIsEditMode(false);
  };

  const duplicateCalc = async () => {
    const newTitle = calcTitle.trim() ? `${calcTitle} (копия)` : 'Расчёт (копия)';
    const res = await fetch('/api/calcs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(newTitle)),
    });
    if (!res.ok) return;
    const created: CalcDoc = await res.json();
    setSavedCalcs((prev) => [...prev, created]);
    setCurrentCalcId(created._id);
    setCalcTitle(newTitle);
  };

  const deleteCurrentCalc = async () => {
    if (!currentCalcId) return;
    const res = await fetch(`/api/calcs/${currentCalcId}`, { method: 'DELETE' });
    if (!res.ok) return;
    setSavedCalcs((prev) => prev.filter((c) => c._id !== currentCalcId));
    setCurrentCalcId(null);
    setIsEditMode(false);
  };

  const startNewCalc = () => {
    setInputs(DEFAULT_CALC_INPUTS);
    setCalcTitle('Новый расчёт');
    setCurrentCalcId(null);
    setIsEditMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ================== РЕНДЕР ================== */
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        {/* Заголовок и действия */}
        <div className={styles.headerBar}>
          <input
            value={calcTitle}
            onChange={(e) => setCalcTitle(e.target.value)}
            className={styles.titleInput}
            placeholder="Введите название расчёта"
          />
          <div className={styles.headerActions}>
            {isEditMode ? (
              <>
                <button className={styles.iconBtn} onClick={saveExistingCalc} title="Сохранить изменения">
                  💾
                </button>
                <button
                  className={styles.iconBtn}
                  onClick={() => {
                    setIsEditMode(false);
                    setCurrentCalcId(null);
                  }}
                  title="Отмена"
                >
                  ↩︎
                </button>
                <button className={styles.iconBtn} onClick={deleteCurrentCalc} title="Удалить">
                  🗑
                </button>
              </>
            ) : (
              <>
                <button className={styles.iconBtn} onClick={createNewCalc} title="Сохранить">
                  💾
                </button>
                <button className={styles.iconBtn} onClick={duplicateCalc} title="Дублировать">
                  ⎘
                </button>
                <button className={styles.iconBtn} onClick={deleteCurrentCalc} title="Удалить">
                  🗑
                </button>
              </>
            )}
          </div>
        </div>

        {/* Формула */}
        <FormulaCard
          v={inputs}
          onChange={handleNumberChange}
          margin={unitMargin}
          ltv={ltv}
          cppu={cppu}
          pppu={pppu}
          fmtR={formatMoney}
        />

        {/* Итого */}
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого:</span>
          <span className={styles.totalValue}>{formatMoney(operatingProfit)}</span>
        </div>

        {/* Остальные метрики */}
        <MetricsSection
          showMore={isMoreMetricsOpen}
          toggle={() => setIsMoreMetricsOpen((s) => !s)}
          fmtR={formatMoney}
          data={metricsForTable}
        />

        {/* Сохранённые расчёты */}
        {savedCalcs.length > 0 && isSavedVisible && (
          <div className={styles.savedBlock}>
            <div className={styles.savedTitle}>Сохранённые расчёты</div>
            <ul className={styles.cardList}>
              {savedCalcs.map((doc) => (
                <li key={doc._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{doc.title}</div>
                    <button
                      className={styles.editLink}
                      onClick={() => {
                        setCurrentCalcId(doc._id);
                        setCalcTitle(doc.title);
                        setInputs({
                          cpc: doc.cpc,
                          cr1: doc.cr1,
                          cr2: doc.cr2,
                          avp: doc.avp,
                          cogs: doc.cogs,
                          ret: doc.ret,
                          au: doc.au,
                        });
                        setIsEditMode(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      ✎ Редактировать
                    </button>
                  </div>

                  <div className={styles.cardFormula}>
                    <span className={styles.fMinus}>–</span>
                    <span>(</span>
                    <b>{format2(doc.cpc)}</b>
                    <span> / </span>
                    <b>{format2(doc.cr1)}</b>
                    <span> / </span>
                    <b>{format2(doc.cr2)}</b>
                    <span>) + (</span>
                    <b>{formatMoney(doc.avp)}</b>
                    <span> – </span>
                    <b>{formatMoney(doc.cogs)}</b>
                    <span>) × </span>
                    <b>{format2(doc.ret)}</b>
                    <span className={styles.eq}>=</span>
                    <b className={styles.pppuValue}>{formatMoney(doc.pppu)}</b>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Нижняя панель: показать/скрыть и «Новый расчёт» */}
        <div className={styles.controlsRow}>
          {savedCalcs.length > 0 && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => setIsSavedVisible((s) => !s)}
            >
              {isSavedVisible ? 'Скрыть сохранённые расчёты' : 'Показать сохранённые расчёты'}
            </button>
          )}

          <button className={styles.btnNew} onClick={startNewCalc}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
            </svg>
            Новый расчёт
          </button>
        </div>

        {/* Сравнение результатов */}
        <CompareResults items={savedCalcs} />
      </div>
    </div>
  );
}