import * as path from 'path';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { convertTitleToSlug } from '@/lib/utils/helpers';

const dir = 'database';
const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');
const db = new Database(dbPath);

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const slug = convertTitleToSlug(title);
    const description = formData.get('description') as string;
    const instructions = formData.get('instructions') as string;
    const creator = formData.get('creator') as string;
    const creator_email = formData.get('creator_email') as string;

    const extension = image?.name?.split('.').pop();
    if (!extension) {
      return NextResponse.json({ error: 'Unknown image issue, maybe wrong size' }, { status: 400 });
    }
    const imageFileName = `${slug}.${extension}`;
    const publicDir = path.resolve(process.cwd(), 'public/meals');
    const imagePath = path.join(publicDir, imageFileName);

    if (fs.existsSync(imagePath)) {
      return NextResponse.json({ error: 'Image already exists' }, { status: 400 });
    }
    const stream = fs.createWriteStream(imagePath);
    const bufferedImage = await image.arrayBuffer();
    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        console.error('Error writing image file:', error);
        return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
      }
      stream.end();
    });

    const mealImage = `/meals/${imageFileName}`;
    const newMeal = { title, slug, image: mealImage, description, instructions, creator, creator_email };
    db.prepare(
      `
        INSERT INTO meals
          (title, slug, image, description, instructions, creator, creator_email)
        VALUES (@title, @slug, @image, @description, @instructions, @creator, @creator_email) RETURNING *;
      `
    ).run(newMeal);

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      message = String((error as { message: unknown }).message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}