// app/api/lead/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect, getDb } from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const MAX_ATTACH_SIZE = 20 * 1024 * 1024; // 20MB

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});

function bytes(n: number) {
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0, v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${u[i]}`;
}

async function saveToUploads(file: File) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const safe = file.name.replace(/[^\w.\-]+/g, '_');
  const key = `${Date.now()}-${crypto.randomUUID()}-${safe}`;
  const full = path.join(uploadsDir, key);

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(full, buf);

  const base = (process.env.BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/uploads/${encodeURIComponent(key)}`;
  return { key, path: full, url };
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const name    = String(form.get('name') ?? '').trim();
    const contact = String(form.get('contact') ?? '').trim();
    const comment = String(form.get('comment') ?? '').trim();
    const file    = form.get('file') as File | null;

    if (!name || !contact) {
      return NextResponse.json({ ok: false, error: 'name/contact required' }, { status: 400 });
    }

    // -------------------- подготовка вложения / ссылки --------------------
    let attachments: any[] = [];
    let fileMeta: any = null;
    let linkInfo: { url: string } | null = null;

    if (file && typeof file.arrayBuffer === 'function' && file.size > 0) {
      // если файл <= лимита — шлём как вложение
      if (file.size <= MAX_ATTACH_SIZE) {
        const buf = Buffer.from(await file.arrayBuffer());
        attachments.push({ filename: file.name, content: buf, contentType: file.type });
        fileMeta = { name: file.name, size: file.size, type: file.type };
      } else {
        // большой файл — кладём в public/uploads и отправляем ссылку
        const saved = await saveToUploads(file);
        linkInfo = { url: saved.url };
        fileMeta = { name: file.name, size: file.size, type: file.type, url: saved.url };
      }
    }

    // -------------------- письмо --------------------
    const htmlBody = `
      <p><b>Новый лид с сайта</b></p>
      <p><b>Имя:</b> ${name}</p>
      <p><b>Контакты:</b> ${contact}</p>
      <p><b>Комментарий:</b><br>${(comment || '-').replace(/\n/g, '<br>')}</p>
      ${
        linkInfo
          ? `<p><b>Файл:</b> <a href="${linkInfo.url}" target="_blank" rel="noreferrer noopener">${linkInfo.url}</a></p>`
          : (fileMeta
              ? `<p><b>Вложение:</b> ${fileMeta.name} (${bytes(fileMeta.size)})</p>`
              : '')
      }
    `;

    async function trySendMail(asLinkFallback = false) {
      return transporter.sendMail({
        from: process.env.EMAIL_FROM!,
        to: process.env.SMTP_USER!, // при необходимости замени на нужный адрес
        subject: `Лид с сайта — ${name}`,
        html: htmlBody,
        attachments: asLinkFallback ? [] : attachments,
      });
    }

    try {
      await trySendMail(false);
    } catch (e: any) {
      const msg = `${e?.message || ''}`.toLowerCase();
      // фоллбэк: если письмо большое -> сохранить файл и отправить ссылку
      if (file && !linkInfo && (msg.includes('552') || msg.includes('file too big'))) {
        const saved = await saveToUploads(file);
        linkInfo = { url: saved.url };
        // пересобираем html c ссылкой
        const htmlWithLink = htmlBody.replace(
          /(<\/p>\s*)$/,
          `<p><b>Файл:</b> <a href="${linkInfo.url}" target="_blank" rel="noreferrer noopener">${linkInfo.url}</a></p>$1`
        );
        await transporter.sendMail({
          from: process.env.EMAIL_FROM!,
          to: process.env.SMTP_USER!,
          subject: `Лид с сайта — ${name}`,
          html: htmlWithLink,
        });
      } else {
        throw e;
      }
    }

    // -------------------- mongo --------------------
    await dbConnect();
    const db = getDb();
    await db.collection('leads').insertOne({
      name,
      contact,
      comment,
      file: fileMeta,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}