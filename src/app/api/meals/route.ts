import * as path from 'path';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { convertStrToSlug } from '@/lib/utils/helpers';
import { uploadImageToCloudinary } from '@/lib/utils/uploadImageToCloudinary';
import { filterMeals } from '@/lib/utils/filterMeals';
import { type MealDbRowType, mealDbToMealData } from '@/lib/utils/mealDataHelpers';
import type { MealInstruction } from '@/types/meals';

const dir = 'database';
const dbPath = path.resolve(process.cwd(), 'database', 'meals.db');
const db = new Database(dbPath);

export async function GET(_req: NextRequest) {
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: 'Database not found' }, { status: 500 });
  }
  try {
    const mealsDbData = db.prepare('SELECT * FROM meals ORDER BY id DESC').all() as MealDbRowType[];
    const meals = await Promise.all(mealsDbData.map(mealDbToMealData));
    const filteredMeals = await filterMeals(meals);

    return NextResponse.json(filteredMeals);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
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
    const ingredients = formData.get('ingredients') as string;
    const instructions = formData.get('instructions') as string;
    const creator = formData.get('creator') as string;
    const creator_email = formData.get('creator_email') as string;
    const imageExtension = image?.name?.split('.').pop();

    if (!image || !image.name || !image.type.startsWith('image/') || !imageExtension) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    const instructionsArray = JSON.parse(instructions) as MealInstruction[];
    if (!Array.isArray(instructionsArray) || instructionsArray.length === 0) {
      return NextResponse.json({ error: 'Instructions must be a non-empty array' }, { status: 400 });
    }

    const mealInstructions: MealInstruction[] = await Promise.all(
      instructionsArray.map(async (item) => {
        let imageUrl: string | undefined;

        if (typeof item.image === 'string' && item.image.startsWith('data:image')) {
          // Split the base64 part from the prefix
          const base64Data = item.image.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          imageUrl = await uploadImageToCloudinary(buffer, `${slug}-step-${item.text.slice(0, 10).replace(/\s+/g, '-')}`);
        }
        console.log('imageUrl', imageUrl);
        return {
          text: item.text,
          image: imageUrl,
        };
      })
    );

    const buffer = Buffer.from(await image.arrayBuffer());
    const mealImageUrl = await uploadImageToCloudinary(buffer, slug);
    const newMeal = {
      title,
      slug,
      image: mealImageUrl,
      description,
      ingredients,
      instructions: JSON.stringify(mealInstructions),
      creator,
      creator_email,
    };
    db.prepare(
      `
        INSERT INTO meals (slug,
                           title,
                           image,
                           description,
                           ingredients,
                           instructions,
                           creator,
                           creator_email)
        VALUES (@slug,
                @title,
                @image,
                @description,
                @ingredients,
                @instructions,
                @creator,
                @creator_email)
      `
    ).run(newMeal);

    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    console.error('POST /api/meals error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}