import { prisma } from '@/utils/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await prisma.meal.findMany();
    return NextResponse.json(db, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
