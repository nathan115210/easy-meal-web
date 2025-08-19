import fs from 'fs';
/*
import { PrismaClient } from '../../generated/prisma';
*/
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//src/lib/database/importDummyData.ts
const data = JSON.parse(fs.readFileSync('meals.json', 'utf-8'));

async function importMeals() {
  for (const meal of data.meals) {
    const ingredients = JSON.parse(meal.ingredients ?? '[]');
    const instructions = JSON.parse(meal.instructions ?? '[]');

    await prisma.meal.create({
      data: {
        title: meal.title,
        slug: meal.slug,
        image: meal.image,
        description: meal.description,
        creator: meal.creator,
        creator_email: meal.creator_email,
        ingredients: {
          create: ingredients.map((i: any) => ({
            text: i.text,
            amount: i.amount,
          })),
        },
        instructions: {
          create: instructions.map((i: any) => ({
            text: i.text,
            image: i.image ?? null,
          })),
        },
      },
    });
  }

  console.log('✅ Imported all meals successfully!');
}

importMeals()
  .catch((e) => {
    console.error('❌ Import failed:', e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
