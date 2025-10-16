import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Calc } from "@/server/models/Calc";
import { isValidObjectId } from "mongoose";

// поля, которые должны быть числовыми
const NUMERIC_FIELDS = [
  "cpc","cr1","cr2","avp","cogs","ret","au",
  "margin","ltv","cppu","pppu","leads","buyers",
  "adSpend","revenue","grossProfit","opProfit",
  "thrCpc","thrCpa","arppu","arpu","cpa","avgOrder",
] as const;

function normalizePayload(raw: any) {
  const data: Record<string, any> = { ...raw };
  for (const k of NUMERIC_FIELDS) {
    if (data[k] !== undefined) {
      const n = Number(data[k]);
      data[k] = Number.isFinite(n) ? n : 0;
    }
  }
  if (typeof data.title !== "string") data.title = String(data.title ?? "");
  return data;
}

// ===== PATCH /api/calcs/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const id = (params?.id || "").trim();
    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const raw = await req.json();
    const body = normalizePayload(raw);

    const updated = await Calc.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/calcs/[id] failed:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

// ===== DELETE /api/calcs/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const id = (params?.id || "").trim();
    if (!isValidObjectId(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const deleted = await Calc.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/calcs/[id] failed:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}