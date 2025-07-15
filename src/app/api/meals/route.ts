import * as path from 'path';
import * as fs from 'fs';
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { Meal } from '@/types/meals';


const dir = 'database';
const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');
const db = new Database(dbPath);

export async function GET(req: NextResponse) {
  // Return failure if the database does not exist
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: 'Database not found' }, { status: 500 });
  }

  try {
    const meals = db.prepare('SELECT * FROM meals ORDER BY id DESC').all();
    return NextResponse.json(meals);
  } catch (error) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      message = String((error as { message: unknown }).message);
    }
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextResponse) {
  try {
    const { title, image, creator, creator_email, slug, description, instructions } = await req.json() as Meal;

    const statement = db.prepare(`
      INSERT INTO meals
        (title, slug, image, description, instructions, creator, creator_email)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *;
    `);
    const newMeal = statement.get(
      title,
      slug,
      image,
      description,
      instructions,
      creator,
      creator_email,
    );
    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      message = String((error as { message: unknown }).message);
    }
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}