
export type ComputeInput = {
  cpc: number;   // ₽ за клик
  cr: number;    // CR1, % посетителей -> лиды
  cps: number;   // CR2, % лидов -> покупатели
  avp: number;   // средний чек
  cogs: number;  // себестоимость
  ret: number;   // среднее число покупок (Retention)
  au: number;    // аудитория/клики
};

export type ComputeResult = {
  // базовые
  leads: number;
  buyers: number;
  margin: number;
  ltv: number;
  cppu: number;
  pppu: number;

  // деньги
  adSpend: number;
  revenue: number;      // без COGS (выручка)
  grossProfit: number;  // маржинальная прибыль
  opProfit: number;     // операционная прибыль

  // дополнительные метрики (часто нужны в “Остальных метриках”)
  thresholdCPC: number; // пороговый CPC (при нулевой прибыли)
  thresholdCPA: number; // пороговый CPA (см. прим.)
  arppu: number;
  arpu: number;
  cpa: number;

  // дубли, если удобно выводить “как есть”
  input: ComputeInput;
};

// безопасное деление
const div = (a: number, b: number) => (b === 0 ? 0 : a / b);

// округление до 2 знаков (для API/отчётов — UI может форматировать по-своему)
const r2 = (n: number) => Math.round(n * 100) / 100;

export function computeServer(input: ComputeInput): ComputeResult {
  const { cpc, cr, cps, avp, cogs, ret, au } = input;

  // CR в долях
  const cr1d = cr / 100;
  const cr2d = cps / 100;

  // воронка
  const leads  = Math.round(au * cr1d);
  const buyers = Math.round(leads * cr2d);

  // экономика
  const margin = avp - cogs;          // прибыль с одной покупки
  const ltv    = margin * ret;        // прибыль с клиента за жизнь
  const cppu   = div(cpc, cr1d) * div(1, cr2d); // стоимость платящего пользователя
  const pppu   = ltv - cppu;          // прибыль на платящего пользователя

  // деньги
  const adSpend     = au * cpc;
  const revenue     = buyers * avp * ret;   // без COGS
  const grossProfit = buyers * margin * ret;
  const opProfit    = grossProfit - adSpend;

  // метрики для блока “Остальные метрики”
  // Пороговый CPC (нулевая прибыль): grossProfit / au
  const thresholdCPC = div(grossProfit, au);

  // Пороговый CPA: максимальная допустимая стоимость покупки.
  // В практиках бывает несколько трактовок; чаще всего используют LTV.
  // Если нужна иная формула — поменяй здесь один раз.
  const thresholdCPA = ltv;

  const arppu = avp * ret;
  const arpu  = div(revenue, au);
  const cpa   = div(cpc, cr1d);       // стоимость лида/покупки на 1-м шаге

  return {
    leads,
    buyers,
    margin: r2(margin),
    ltv: r2(ltv),
    cppu: r2(cppu),
    pppu: r2(pppu),

    adSpend: r2(adSpend),
    revenue: r2(revenue),
    grossProfit: r2(grossProfit),
    opProfit: r2(opProfit),

    thresholdCPC: r2(thresholdCPC),
    thresholdCPA: r2(thresholdCPA),
    arppu: r2(arppu),
    arpu: r2(arpu),
    cpa: r2(cpa),

    input,
  };
}