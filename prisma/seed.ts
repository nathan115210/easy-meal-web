import 'dotenv/config';
import { prisma } from '@/utils/lib/prisma';
import { mealsSeedData } from './seedData';
import { DifficultyLevel } from '@/utils/types/meals';

export async function main() {
  for (const meal of mealsSeedData) {
    await prisma.meal.create({
      data: {
        title: meal.title,
        description: meal.description,
        image: meal.image,
        mealType: meal.mealType,
        cookTime: meal.cookTime ?? 0,
        tags: meal.tags,
        difficulty: meal.difficulty as DifficultyLevel,
        calories: meal.nutritionInfo?.calories ?? 0,
        protein: meal.nutritionInfo?.protein ?? 0,
        carbs: meal.nutritionInfo?.carbs ?? 0,
        fat: meal.nutritionInfo?.fat ?? 0,
        ingredients: {
          create: meal.ingredients.map((ing) => ({
            text: ing.text,
            amount: ing.amount,
          })),
        },
        instructions: {
          create: meal.instructions.map((step) => ({
            step: step.step,
            text: step.text,
            image: step.image ?? '',
          })),
        },
      },
    });
  }

  console.log(`Seeded ${mealsSeedData.length} meals`);
}

main()
  .catch((e) => {
    console.error('Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
