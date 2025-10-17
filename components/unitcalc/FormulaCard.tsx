'use client';

import React from 'react';
import s from '../../styles/formula.v2.module.scss';

type Inputs = {
  cpc: number; cr1: number; cr2: number;
  avp: number; cogs: number; ret: number; au: number;
};

type Props = {
  v: Inputs;
  onChange: (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  margin: number; ltv: number; cppu: number; pppu: number;
  fmt?: (n: number) => string;  // новый проп
  fmtR?: (n: number) => string; // поддержка старого имени
};

export default function FormulaCard({
  v, onChange, margin, ltv, cppu, pppu, fmt, fmtR,
}: Props) {
  const format =
    fmt ?? fmtR ?? ((n: number) =>
      n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }));

  return (
    <div className={s.formula}>
      <span className={s.op}>−</span>
      <span className={s.brace}>(</span>

      {/* LEFT */}
      <div className={`${s.group} ${s.left}`}>
        <div className={s.inputsLeft}>
          <label className={s.box}>
            <span className={s.label}>CPC, ₽</span>
            <input value={v.cpc} onChange={onChange('cpc')} className={s.input} inputMode="decimal" />
            <span className={s.tip}>
              <b>Cost Per Click</b><br />
              Стоимость привлечения посетителя — фактические затраты на один клик.
            </span>
          </label>

          <span className={s.sep}>/</span>

          <label className={s.box}>
            <span className={s.label}>CR1, %</span>
            <input value={v.cr1} onChange={onChange('cr1')} className={s.input} inputMode="decimal" />
            <span className={s.tip}>
              <b>Conversion Rate 1</b><br />
              Конверсия из клика в заявку (лид).
            </span>
          </label>

          <span className={s.sep}>/</span>

          <label className={s.box}>
            <span className={s.label}>CR2, %</span>
            <input value={v.cr2} onChange={onChange('cr2')} className={s.input} inputMode="decimal" />
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
              <input value={v.avp} onChange={onChange('avp')} className={s.input} inputMode="decimal" />
              <span className={s.tip}>
                <b>Average Purchase</b><br />
                Средний чек за одну покупку.
              </span>
            </label>

            <span className={s.innerOp}>−</span>

            <label className={s.box}>
              <span className={s.label}>COGS, ₽</span>
              <input value={v.cogs} onChange={onChange('cogs')} className={s.input} inputMode="decimal" />
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
            <input value={v.ret} onChange={onChange('ret')} className={s.input} inputMode="decimal" />
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
        <input value={v.au} onChange={onChange('au')} className={s.input} inputMode="numeric" />
        <span className={s.tip}>
          <b>Acquired Users</b><br />
          Количество привлечённых пользователей.
        </span>
        <div className={s.noteText}>Количество привлечённых пользователей</div>
      </label>
    </div>
  );
}