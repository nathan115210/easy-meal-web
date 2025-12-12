import { DifficultyLevel, Meal, MealType as UiMealType, NutritionInfo } from '@/utils/types/meals';
import { prisma } from '@/utils/lib/prisma';
import { slugify } from '@/utils/lib/helpers';
import { MealType as PrismaMealType, Prisma } from '../../../prisma/generated/prisma/client';

export async function getMealsData(): Promise<Meal[]> {
  const mealsDb = await prisma.meal.findMany({
    include: {
      ingredients: true,
      instructions: true,
    },
    orderBy: { id: 'asc' },
  });

  return mealsDb.map(extractDbToMeal);
}

export async function getMealBySlug(slug: string): Promise<Meal | undefined> {
  // Fetch all meal titles and IDs
  const mealsMeta = await prisma.meal.findMany({
    select: { id: true, title: true },
  });
  const matchedMealMeta = mealsMeta.find((meal) => slugify(meal.title) === slug);
  if (!matchedMealMeta) {
    return undefined;
  }

  // Fetch the full meal with relations by ID
  const mealDb = await prisma.meal.findUnique({
    where: { id: matchedMealMeta.id },
    include: {
      ingredients: true,
      instructions: true,
    },
  });

  if (!mealDb) return undefined;

  return extractDbToMeal(mealDb);
}

type DbMealWithRelations = Prisma.MealGetPayload<{
  include: { ingredients: true; instructions: true };
}>;

const extractDbToMeal = (dbMeal: DbMealWithRelations): Meal => {
  const nutritionInfo: NutritionInfo = {
    calories: dbMeal.calories,
    protein: dbMeal.protein,
    carbs: dbMeal.carbs,
    fat: dbMeal.fat,
  };

  return {
    title: dbMeal.title,
    slug: slugify(dbMeal.title),
    image: dbMeal.image,
    description: dbMeal.description,
    ingredients: dbMeal.ingredients.map((ing) => ({
      id: ing.id,
      text: ing.text,
      amount: ing.amount,
    })),
    instructions: dbMeal.instructions
      .slice()
      .sort((a, b) => a.step - b.step)
      .map((inst) => ({
        id: inst.id,
        text: inst.text,
        image: inst.image ?? '',
        step: inst.step,
      })),
    cookTime: dbMeal.cookTime,
    difficulty: dbMeal.difficulty as DifficultyLevel,
    nutritionInfo,
    mealType: dbMeal.mealType.map(mapPrismaMealTypeToUi),
    tags: dbMeal.tags,
  };
};

function mapPrismaMealTypeToUi(type: PrismaMealType): UiMealType {
  switch (type) {
    case PrismaMealType.breakfast:
      return UiMealType.Breakfast;
    case PrismaMealType.lunch:
      return UiMealType.Lunch;
    case PrismaMealType.dinner:
      return UiMealType.Dinner;
    case PrismaMealType.snacks:
      return UiMealType.Snacks;
    case PrismaMealType.dessert:
      return UiMealType.Dessert;
    case PrismaMealType.drinks:
      return UiMealType.Drinks;
  }
}
