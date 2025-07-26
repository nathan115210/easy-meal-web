import { Meal } from '@/types/meals';

const mealPlaceholder = '/meal-placeholder.png';

export const filterSingleMeal = async (meal: Meal): Promise<Meal> => {
  try {
    const res = await fetch(meal.image, { method: 'HEAD' });
    if (!res.ok) {
      const { image, ...rest } = meal;
      return { ...rest, image: mealPlaceholder };
    }
    return meal;
  } catch {
    const { image, ...rest } = meal;
    return { ...rest, image: mealPlaceholder };
  }
};

export const filterMeals = async (meals: Meal[]): Promise<Meal[]> => {
  const processedMeals = await Promise.all(meals.map(filterSingleMeal));
  return processedMeals.filter((meal) => meal && meal.slug != null);
};
