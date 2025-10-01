import { Meal } from '@/types/meals';
// Placeholder image path used when the original meal image is unavailable
const mealPlaceholder = '/meal-placeholder.png';

/**
 * Checks if the meal's image URL is valid.
 * If not, replaces it with a placeholder image.
 * @param meal - The meal object to check and update
 * @returns The meal object with a valid image URL
 */
export const filterSingleMeal = async (meal: Meal): Promise<Meal> => {
  try {
    // Attempt to fetch the image header to verify its existence
    const res = await fetch(meal.image, { method: 'HEAD' });
    if (!res.ok) {
      // If the image does not exist, replace with placeholder
      const { image, ...rest } = meal;
      return { ...rest, image: mealPlaceholder };
    }
    // If the image exists, return the meal as is
    return meal;
  } catch {
    // On fetch error, also use the placeholder image
    const { image, ...rest } = meal;
    return { ...rest, image: mealPlaceholder };
  }
};

/**
 * Processes an array of meals:
 * - Replaces invalid meal images with a placeholder using filterSingleMeal.
 * - Filters out any meals that are null/undefined or missing a slug.
 * @param meals - Array of Meal objects to process
 * @returns Array of valid Meal objects with ensured image URLs
 */

export const filterMeals = async (meals: Meal[]): Promise<Meal[]> => {
  const processedMeals = await Promise.all(meals.map(filterSingleMeal));
  return processedMeals.filter((meal) => meal && meal.slug != null);
};
