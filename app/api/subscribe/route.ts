import { NextRequest, NextResponse } from 'next/server';
import { dbConnect, getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Bad email' }, { status: 400 });
    }

    await dbConnect();
    const db = getDb();
    await db.collection('subscribers').updateOne(
      { email: email.toLowerCase().trim() },
      { $set: { email: email.toLowerCase().trim(), createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Server error' }, { status: 500 });
  }
}