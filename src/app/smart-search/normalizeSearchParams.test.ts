import { describe, expect, it } from 'vitest';
import { normalizeSearchParams } from './normalizeSearchParams';
import { CaloriesValue, CookTimeValue, DifficultyLevel, MealType } from '@/utils/types/meals';

describe('normalizeSearchParams', () => {
  it('SHOULD return all enum defaults when params is empty', () => {
    const result = normalizeSearchParams({});
    expect(result.cookTime).toBe(CookTimeValue.Any);
    expect(result.maxCalories).toBe(CaloriesValue.Any);
    expect(result.difficultyLevel).toBe(DifficultyLevel.Any);
    expect(result.mealType).toEqual([]);
    expect(result.search).toBe('');
    expect(result.dietaryPreferences).toEqual([]);
    expect(result.existIngredients).toEqual([]);
    expect(result.excludeIngredients).toEqual([]);
    expect(result.specialTags).toEqual([]);
    expect(result.occasionTags).toEqual([]);
    expect(result.healthTags).toEqual([]);
  });

  it('SHOULD parse a valid cookTime string param', () => {
    const result = normalizeSearchParams({ cookTime: 'under_30' });
    expect(result.cookTime).toBe(CookTimeValue.Under30);
  });

  it('SHOULD fall back to CookTimeValue.Any for an unrecognised cookTime value', () => {
    const result = normalizeSearchParams({ cookTime: 'bogus_value' });
    expect(result.cookTime).toBe(CookTimeValue.Any);
  });

  it('SHOULD parse a valid maxCalories string param', () => {
    const result = normalizeSearchParams({ maxCalories: 'under_600' });
    expect(result.maxCalories).toBe(CaloriesValue.Under600);
  });

  it('SHOULD fall back to CaloriesValue.Any for an unrecognised maxCalories value', () => {
    const result = normalizeSearchParams({ maxCalories: 'not_valid' });
    expect(result.maxCalories).toBe(CaloriesValue.Any);
  });

  it('SHOULD parse a valid difficultyLevel string param', () => {
    const result = normalizeSearchParams({ difficultyLevel: 'hard' });
    expect(result.difficultyLevel).toBe(DifficultyLevel.Hard);
  });

  it('SHOULD fall back to DifficultyLevel.Any for an unrecognised difficultyLevel value', () => {
    const result = normalizeSearchParams({ difficultyLevel: 'impossible' });
    expect(result.difficultyLevel).toBe(DifficultyLevel.Any);
  });

  it('SHOULD parse a single valid mealType string param', () => {
    const result = normalizeSearchParams({ mealType: 'dinner' });
    expect(result.mealType).toEqual([MealType.Dinner]);
  });

  it('SHOULD parse multiple mealType values from an array param', () => {
    const result = normalizeSearchParams({ mealType: ['breakfast', 'lunch'] });
    expect(result.mealType).toEqual([MealType.Breakfast, MealType.Lunch]);
  });

  it('SHOULD filter out invalid mealType values from an array param', () => {
    const result = normalizeSearchParams({ mealType: ['dinner', 'midnight_snack'] });
    expect(result.mealType).toEqual([MealType.Dinner]);
  });

  it('SHOULD split a comma-separated mealType string into individual values', () => {
    const result = normalizeSearchParams({ mealType: 'breakfast,lunch' });
    expect(result.mealType).toEqual([MealType.Breakfast, MealType.Lunch]);
  });

  it('SHOULD parse the search param as a plain string', () => {
    const result = normalizeSearchParams({ search: 'pasta' });
    expect(result.search).toBe('pasta');
  });

  it('SHOULD use the first element when search is an array', () => {
    const result = normalizeSearchParams({ search: ['pasta', 'curry'] });
    expect(result.search).toBe('pasta');
  });

  it('SHOULD split comma-separated existIngredients into an array', () => {
    const result = normalizeSearchParams({ existIngredients: 'eggs,milk' });
    expect(result.existIngredients).toEqual(['eggs', 'milk']);
  });

  it('SHOULD split comma-separated excludeIngredients into an array', () => {
    const result = normalizeSearchParams({ excludeIngredients: 'peanuts, gluten' });
    expect(result.excludeIngredients).toEqual(['peanuts', 'gluten']);
  });

  it('SHOULD parse dietaryPreferences, healthTags, specialTags, and occasionTags as arrays', () => {
    const result = normalizeSearchParams({
      dietaryPreferences: 'vegan',
      healthTags: 'low_sodium,high_fiber',
      specialTags: 'quick',
      occasionTags: 'weeknight',
    });
    expect(result.dietaryPreferences).toEqual(['vegan']);
    expect(result.healthTags).toEqual(['low_sodium', 'high_fiber']);
    expect(result.specialTags).toEqual(['quick']);
    expect(result.occasionTags).toEqual(['weeknight']);
  });
});
