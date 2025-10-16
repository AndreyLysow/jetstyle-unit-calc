import { Schema, model, models } from "mongoose";

const CalcSchema = new Schema(
  {
    title: { type: String, required: true },

    // inputs
    cpc: Number,
    cr1: Number,
    cr2: Number,
    avp: Number,
    cogs: Number,
    ret: Number,
    au: Number,

    // derived (старые)
    margin: Number,
    ltv: Number,
    cppu: Number,
    pppu: Number,
    leads: Number,
    buyers: Number,
    adSpend: Number,
    revenue: Number,
    grossProfit: Number,
    opProfit: Number,

    // derived (НОВЫЕ — чтобы все "доп. метрики" тоже сохранялись)
    thrCpc: Number,   // пороговый CPC
    thrCpa: Number,   // пороговый CPA
    arppu: Number,    // ARPPU
    arpu: Number,     // ARPU
    cpa: Number,      // фактический CPA
    avgOrder: Number, // просто дублируем avp, удобно для экспорта
  },
  { timestamps: true }
);

export type CalcDoc = {
  _id: string;
  title: string;

  // inputs
  cpc: number; cr1: number; cr2: number; avp: number; cogs: number; ret: number; au: number;

  // derived (старые)
  margin: number; ltv: number; cppu: number; pppu: number;
  leads: number; buyers: number; adSpend: number; revenue: number;
  grossProfit: number; opProfit: number;

  // derived (НОВЫЕ)
  thrCpc: number; thrCpa: number; arppu: number; arpu: number; cpa: number; avgOrder: number;

  createdAt: string;
};

export const Calc = models.Calc || model("Calc", CalcSchema);