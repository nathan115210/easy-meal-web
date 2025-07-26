import * as path from 'path';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { convertStrToSlug } from '@/lib/utils/helpers';
import { uploadImageToCloudinary } from '@/lib/utils/uploadImageToCloudinary';
import { Meal } from '@/types/meals';
import { filterMeals } from '@/lib/utils/filterMeals';

const dir = 'database';
const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');
const db = new Database(dbPath);

export async function GET(_req: NextRequest) {
  // Return failure if the database does not exist
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: 'Database not found' }, { status: 500 });
  }
  try {
    const meals = db.prepare('SELECT * FROM meals ORDER BY id DESC').all() as Meal[];
    // Filter out meals with missing images
    const filteredMeals = await filterMeals(meals);

    return NextResponse.json(filteredMeals);
  } catch (error) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      message = String((error as { message: unknown }).message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const slug = convertStrToSlug(title);
    const description = formData.get('description') as string;
    const instructions = formData.get('instructions') as string;
    const creator = formData.get('creator') as string;
    const creator_email = formData.get('creator_email') as string;
    const imageExtension = image?.name?.split('.').pop();

    if (!image || !image.name || !image.type.startsWith('image/') || !imageExtension) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const mealImageUrl = await uploadImageToCloudinary(buffer, slug);

    const newMeal = { title, slug, image: mealImageUrl, description, instructions, creator, creator_email };
    db.prepare(
      `
        INSERT INTO meals
          (title, slug, image, description, instructions, creator, creator_email)
        VALUES (@title, @slug, @image, @description, @instructions, @creator, @creator_email) RETURNING *;
      `
    ).run(newMeal);

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    console.error('POST /api/meals error:', error);
    let message = 'Unknown error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      message = String((error as { message: unknown }).message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
