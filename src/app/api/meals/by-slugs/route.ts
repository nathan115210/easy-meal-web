// /api/meals/by-slugs

import * as path from 'path';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { type MealDbRowType, mealDbToMealData } from '@/lib/utils/mealDataHelpers';
import { filterMeals } from '@/lib/utils/filterMeals';
import { Meal } from '@/types/meals';

export const runtime = 'nodejs';

const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');

export async function POST(req: NextRequest) {
  try {
    if (!fs.existsSync(path.dirname(dbPath))) {
      return NextResponse.json({ error: 'Database not found' }, { status: 500 });
    }

    const { slugs } = (await req.json()) as { slugs?: string[] };
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const unique = Array.from(new Set(slugs.filter(Boolean)));
    // Hard safety cap (optional)
    if (unique.length > 50) unique.length = 50;

    const db = new Database(dbPath);
    const placeholders = unique.map(() => '?').join(',');
    const rows = db
      .prepare(
        `SELECT *
         FROM meals
         WHERE slug IN (${placeholders})`
      )
      .all(...unique) as MealDbRowType[];

    const meals = await Promise.all(rows.map(mealDbToMealData));

    // Preserve the original order
    const map = new Map(meals.map((m) => [m.slug, m]));
    const orderedMeals = slugs.map((s) => map.get(s)).filter((m): m is Meal => m !== undefined);
    // Filter meals asynchronously and preserve order
    const filteredMeals = await filterMeals(orderedMeals);

    return new NextResponse(JSON.stringify(filteredMeals), {
      headers: {
        'Content-Type': 'application/json',
        // cache at the edge for 5 min; serve stale for 60s while revalidating
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
