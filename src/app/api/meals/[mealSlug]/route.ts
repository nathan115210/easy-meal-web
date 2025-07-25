import * as path from 'path';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import type { Meal } from '@/types/meals';

const dbDir = path.resolve(process.cwd(), 'database');
const dbPath = path.join(dbDir, 'meals.db');
const db = new Database(dbPath, { verbose: console.log });

export async function GET(_req: NextRequest, { params }: { params: { mealSlug: string } }) {
  if (!fs.existsSync(dbDir)) {
    return NextResponse.json({ error: 'Database not found' }, { status: 500 });
  }

  const { mealSlug } = await params;

  const meal = db.prepare('SELECT * FROM meals WHERE slug = ?').get(mealSlug) as Meal | undefined;

  if (!meal) {
    return NextResponse.json({ error: `Meal "${mealSlug}" not found` }, { status: 404 });
  }

  return NextResponse.json({ meal });
}