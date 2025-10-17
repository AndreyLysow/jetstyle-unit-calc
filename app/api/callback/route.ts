import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const name = String(fd.get('name') || '');
    const contact = String(fd.get('contact') || '');
    const comment = String(fd.get('comment') || '');
    const file = fd.get('file') as File | null;

    if (!name || !contact) {
      return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE) !== 'false',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    const attachments = [];
    if (file && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buf,
        contentType: file.type || 'application/octet-stream',
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'UnitCalc <no-reply@local.test>',
      to: process.env.EMAIL_TO || process.env.SMTP_USER || 'dev@localhost',
      subject: 'Заявка на консультацию (Unit-Calc)',
      html: `
        <h3>Новая заявка на консультацию</h3>
        <p><b>Имя:</b> ${escapeHtml(name)}</p>
        <p><b>Контакт:</b> ${escapeHtml(contact)}</p>
        <p><b>Комментарий:</b><br>${escapeHtml(comment).replace(/\n/g,'<br>')}</p>
      `,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Callback error', e);
    return NextResponse.json({ ok: false, error: 'Mailer error' }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!)
  );
}