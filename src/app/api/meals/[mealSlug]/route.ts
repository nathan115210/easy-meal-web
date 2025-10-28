import * as path from 'path';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { filterSingleMeal } from '@/lib/utils/filterMeals';
import { type MealDbRowType, mealDbToMealData } from '@/lib/utils/mealDataHelpers';

const dbDir = path.resolve(process.cwd(), 'database');
const dbPath = path.join(dbDir, 'meals.db');
const db = new Database(dbPath, { verbose: console.log });

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/meals/[mealSlug]'>) {
  if (!fs.existsSync(dbDir)) {
    return NextResponse.json({ error: 'Database not found' }, { status: 500 });
  }

  const { mealSlug } = await ctx.params;

  const mealDbData = db.prepare('SELECT * FROM meals WHERE slug = ?').get(mealSlug) as
    | MealDbRowType
    | undefined;

  if (!mealDbData) {
    return NextResponse.json({ error: `Meal "${mealSlug}" not found` }, { status: 404 });
  }

  const meal = mealDbToMealData(mealDbData);

  const filteredMeal = await filterSingleMeal(meal);
  return NextResponse.json({ meal: filteredMeal });
}
