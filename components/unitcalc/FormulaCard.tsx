'use client';

import React, { useEffect, useMemo, useState } from 'react';
import s from '../../styles/formula.v2.module.scss';

type Inputs = {
  cpc: number; cr1: number; cr2: number;
  avp: number; cogs: number; ret: number; au: number;
};

type Props = {
  v: Inputs;
  onChange: (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  margin: number; ltv: number; cppu: number; pppu: number;
  fmt?: (n: number) => string;   // новый проп
  fmtR?: (n: number) => string;  // поддержка старого имени
};

/**
 * Локальный прокси-инпут для десятичных значений.
 * - Позволяет вводить запятую/точку;
 * - Пока пользователь печатает "2," или "2,5" — значение не «обрезается»,
 *   потому что мы держим локальную строку;
 * - Во внешний onChange отправляем синтетическое событие с нормализованной точкой.
 */
function DecInput({
  value,
  onChange,
  className,
  inputMode = 'decimal',
  placeholder,
  ariaLabel,
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [text, setText] = useState<string>('');

  // Синхронизируем локальный текст, если пришло новое число «сверху»
  useEffect(() => {
    // Показываем исходное число как строку (с точкой)
    setText(Number.isFinite(value) ? String(value) : '');
  }, [value]);

  // Парсер: допускаем пустую строку / «-» / «2,» / «2.» (ещё не число)
  const accept = (s: string) => /^-?\d*(?:[.,]\d*)?$/.test(s);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!accept(raw)) {
      // Игнорируем символ, который не проходит паттерн
      return;
    }
    setText(raw);

    // Нормализуем для внешнего стейта: заменяем запятую на точку
    const normalized = raw.replace(',', '.');

    // Формируем синтетическое event-объект со значением normalized
    const synthetic = {
      ...e,
      target: { ...e.target, value: normalized }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(synthetic);
  };

  // На blur можно слегка подчистить хвосты: "2." -> "2", ",5" -> "0.5"
  const handleBlur = () => {
    if (text === '' || text === '-' || text === '.' || text === ',' ) return;
    let t = text.replace(',', '.');
    if (t.startsWith('.')) t = '0' + t;
    if (t.endsWith('.') ) t = t.slice(0, -1);
    setText(t);
  };

  return (
    <input
      type="text"
      inputMode={inputMode}
      pattern="^-?\d*[.,]?\d*$"
      autoComplete="off"
      className={className}
      value={text}
      onChange={handleInput}
      onBlur={handleBlur}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}

export default function FormulaCard({
  v, onChange, margin, ltv, cppu, pppu, fmt, fmtR,
}: Props) {
  const format =
    fmt ?? fmtR ?? ((n: number) =>
      n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }));

  // обёртка чтобы не дублировать onChange(k)
  const bind = (k: keyof Inputs) => onChange(k);

  return (
    <div className={s.formula}>
      <span className={s.op}>−</span>
      <span className={s.brace}>(</span>

      {/* LEFT */}
      <div className={`${s.group} ${s.left}`}>
        <div className={s.inputsLeft}>
          <label className={s.box}>
            <span className={s.label}>CPC, ₽</span>
            <DecInput value={v.cpc} onChange={bind('cpc')} className={s.input} />
            <span className={s.tip}>
              <b>Cost Per Click</b><br />
              Стоимость привлечения посетителя — фактические затраты на один клик.
            </span>
          </label>

          <span className={s.sep}>/</span>

          <label className={s.box}>
            <span className={s.label}>CR1, %</span>
            <DecInput value={v.cr1} onChange={bind('cr1')} className={s.input} />
            <span className={s.tip}>
              <b>Conversion Rate 1</b><br />
              Конверсия из клика в заявку (лид).
            </span>
          </label>

          <span className={s.sep}>/</span>

          <label className={s.box}>
            <span className={s.label}>CR2, %</span>
            <DecInput value={v.cr2} onChange={bind('cr2')} className={s.input} />
            <span className={s.tip}>
              <b>Conversion Rate 2</b><br />
              Конверсия из заявки в покупку.
            </span>
          </label>
        </div>

        <div className={s.bottomRow}>
          <div className={s.noteTitle}>CPPU</div>
          <div className={s.loss}>{cppu ? `− ${format(cppu)}` : '—'}</div>
        </div>
        <div className={s.noteText}>Стоимость привлечения платящего пользователя</div>
      </div>

      <span className={s.brace}>)</span>
      <span className={s.op}>+</span>
      <span className={s.brace}>(</span>

      {/* MID + RET */}
      <div className={s.midCombo}>
        <div className={`${s.group} ${s.mid}`}>
          <div className={s.inputsMid}>
            <label className={s.box}>
              <span className={s.label}>AVP, ₽</span>
              <DecInput value={v.avp} onChange={bind('avp')} className={s.input} />
              <span className={s.tip}>
                <b>Average Purchase</b><br />
                Средний чек за одну покупку.
              </span>
            </label>

            <span className={s.innerOp}>−</span>

            <label className={s.box}>
              <span className={s.label}>COGS, ₽</span>
              <DecInput value={v.cogs} onChange={bind('cogs')} className={s.input} />
              <span className={s.tip}>
                <b>Cost of Goods Sold</b><br />
                Себестоимость товара/услуги.
              </span>
            </label>
          </div>

          <div className={s.subNote}>
            Margin (Прибыль) <b>{format(margin)}</b>
          </div>

          <div className={s.ltv}>
            <span className={s.noteTitle}>LTV (Доход с одного клиента за всё время)</span>
            <span className={s.noteValue}>{format(ltv)}</span>
          </div>
        </div>

        <div className={s.inMul} />

        <div className={`${s.group} ${s.ret}`}>
          <label className={s.box}>
            <span className={s.label}>Ret</span>
            <DecInput value={v.ret} onChange={bind('ret')} className={s.input} />
            <span className={s.tip}>
              <b>Retention</b><br />
              Среднее число покупок одним клиентом за весь срок жизни.
            </span>
          </label>
        </div>
      </div>

      <span className={s.brace}>)</span>

      {/* PPPU / AU */}
      <div className={s.pppuRow}>
        <span className={s.eq}>=</span>
        <div className={s.pppu}>
          <div className={s.pppuLabel}>PPPU, ₽</div>
          <div className={s.pppuValue}>
            {format(pppu)}
            <span className={s.tip}>
              <b>Profit Per Paying User</b><br />
              Прибыль на одного платящего пользователя.
            </span>
          </div>
        </div>
      </div>

      <label className={s.au}>
        <span className={s.label}>AU</span>
        <DecInput value={v.au} onChange={bind('au')} className={s.input} inputMode="numeric" />
        <span className={s.tip}>
          <b>Acquired Users</b><br />
          Количество привлечённых пользователей.
        </span>
        <div className={s.noteText}>Количество привлечённых пользователей</div>
      </label>
    </div>
  );
}