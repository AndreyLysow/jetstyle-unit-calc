// app/api/export-xsl/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Row = {
  title: string;
  thrCpc: number;
  thrCpa: number;
  cpa: number;
  revenue: number;
  grossProfit: number;
  pppu: number;
};

function rowsToExcelHtml(rows: Row[]) {
  // Простой HTML-табличный «xls» — Excel открывает без проблем
  const esc = (x: string | number) =>
    String(x ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const head =
    "<tr>" +
    ["Расчёт", "Пороговый CPC, ₽", "Пороговый CPA, ₽", "CPA, ₽", "Revenue, ₽", "Gross Profit, ₽", "PPPU, ₽"]
      .map((h) => `<th style="text-align:left;border:1px solid #ddd;padding:4px">${esc(h)}</th>`)
      .join("") +
    "</tr>";

  const body = rows
    .map((r) => {
      const cols = [
        r.title,
        r.thrCpc,
        r.thrCpa,
        r.cpa,
        r.revenue,
        r.grossProfit,
        r.pppu,
      ]
        .map((c) => `<td style="border:1px solid #ddd;padding:4px">${esc(c)}</td>`)
        .join("");
      return `<tr>${cols}</tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body>
  <table border="1" cellspacing="0" cellpadding="0">
    ${head}
    ${body}
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const { email, rows } = (await req.json()) as { email?: string; rows?: Row[] };

    if (!email || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
    }

    // 1) Готовим «xls»-вложение (на деле HTML-таблица, Excel открывает как xls)
    const html = rowsToExcelHtml(rows);
    const attachment = Buffer.from(html, "utf8");

    // 2) SMTP-транспорт
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE) === "true", // 465 = true, 587 = false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3) Отправка
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,      // ДОЛЖЕН совпадать с ящиком, на который выдан пароль приложения
      to: email,
      subject: "Unit-Calc — расчёты (XLS)",
      text: "Во вложении — файл с результатами сравнения.",
      attachments: [
        {
          filename: "unit-calc.xls",
          content: attachment,
          contentType: "application/vnd.ms-excel",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("export-xsl error:", e?.message || e);
    return NextResponse.json(
      { ok: false, error: "SMTP error: " + (e?.message || "unknown") },
      { status: 500 },
    );
  }
}