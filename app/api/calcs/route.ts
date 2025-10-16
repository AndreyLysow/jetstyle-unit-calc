import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Calc } from "@/server/models/Calc";

// какие поля должны быть ЧИСЛАМИ
const NUMERIC_FIELDS = [
  "cpc","cr1","cr2","avp","cogs","ret","au",
  "margin","ltv","cppu","pppu","leads","buyers","adSpend","revenue",
  "grossProfit","opProfit",
  "thrCpc","thrCpa","arppu","arpu","cpa","avgOrder"
] as const;

function normalizePayload(raw: any) {
  const data: any = { ...raw };
  for (const key of NUMERIC_FIELDS) {
    if (data[key] !== undefined) data[key] = Number(data[key]);
  }
  // title оставляем как есть, строка обязательна
  if (typeof data.title !== "string") data.title = String(data.title ?? "");
  return data;
}

// ===== GET /api/calcs
export async function GET() {
  await dbConnect();
  const list = await Calc.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(list);
}

// ===== POST /api/calcs
export async function POST(req: NextRequest) {
  await dbConnect();
  const raw = await req.json();
  const body = normalizePayload(raw);
  const created = await Calc.create(body);
  return NextResponse.json(created);
}