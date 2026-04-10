import { describe, expect, it } from 'vitest';
import { applySmartSearchToParams } from './applySmartSearchToParams';
import {
  CaloriesValue,
  CookTimeValue,
  DifficultyLevel,
  MealType,
  SmartSearchOptionsState,
} from '@/utils/types/meals';

const defaultOptions: SmartSearchOptionsState = {
  existIngredients: [],
  excludeIngredients: [],
  cookTime: CookTimeValue.Any,
  maxCalories: CaloriesValue.Any,
  difficultyLevel: DifficultyLevel.Any,
  dietaryPreferences: [],
  mealType: [],
  specialTags: [],
  occasionTags: [],
  healthTags: [],
};

describe('applySmartSearchToParams', () => {
  it('SHOULD return a URLSearchParams without smart-search keys when all options are defaults', () => {
    const base = new URLSearchParams();
    const result = applySmartSearchToParams(base, defaultOptions);
    expect(result.has('cookTime')).toBe(false);
    expect(result.has('maxCalories')).toBe(false);
    expect(result.has('difficultyLevel')).toBe(false);
    expect(result.has('mealType')).toBe(false);
    expect(result.has('searchTags')).toBe(false);
  });

  it('SHOULD preserve existing query params that are not in options', () => {
    const base = new URLSearchParams({ search: 'burger' });
    const result = applySmartSearchToParams(base, defaultOptions);
    expect(result.get('search')).toBe('burger');
  });

  it('SHOULD not mutate the base URLSearchParams', () => {
    const base = new URLSearchParams({ search: 'curry' });
    applySmartSearchToParams(base, { ...defaultOptions, cookTime: CookTimeValue.Under30 });
    expect(base.has('cookTime')).toBe(false);
  });

  it('SHOULD set cookTime param when a non-any value is provided', () => {
    const result = applySmartSearchToParams(new URLSearchParams(), {
      ...defaultOptions,
      cookTime: CookTimeValue.Under30,
    });
    expect(result.get('cookTime')).toBe('under_30');
  });

  it('SHOULD remove cookTime param when the value is "any"', () => {
    const base = new URLSearchParams({ cookTime: 'under_30' });
    const result = applySmartSearchToParams(base, {
      ...defaultOptions,
      cookTime: CookTimeValue.Any,
    });
    expect(result.has('cookTime')).toBe(false);
  });

  it('SHOULD set maxCalories param when a non-any value is provided', () => {
    const result = applySmartSearchToParams(new URLSearchParams(), {
      ...defaultOptions,
      maxCalories: CaloriesValue.Under600,
    });
    expect(result.get('maxCalories')).toBe('under_600');
  });

  it('SHOULD set difficultyLevel param when a non-any value is provided', () => {
    const result = applySmartSearchToParams(new URLSearchParams(), {
      ...defaultOptions,
      difficultyLevel: DifficultyLevel.Easy,
    });
    expect(result.get('difficultyLevel')).toBe('easy');
  });

  it('SHOULD append multiple mealType values as repeated params', () => {
    const result = applySmartSearchToParams(new URLSearchParams(), {
      ...defaultOptions,
      mealType: [MealType.Breakfast, MealType.Dinner],
    });
    expect(result.getAll('mealType')).toEqual(['breakfast', 'dinner']);
  });

  it('SHOULD remove mealType param when the array is empty', () => {
    const base = new URLSearchParams({ mealType: 'dinner' });
    const result = applySmartSearchToParams(base, { ...defaultOptions, mealType: [] });
    expect(result.has('mealType')).toBe(false);
  });

  it('SHOULD compose searchTags from dietaryPreferences, healthTags, specialTags, and occasionTags', () => {
    const result = applySmartSearchToParams(new URLSearchParams(), {
      ...defaultOptions,
      dietaryPreferences: ['vegan'],
      healthTags: ['low_sodium'],
      specialTags: ['quick'],
      occasionTags: ['weeknight'],
    });
    const tags = result.getAll('searchTags');
    expect(tags).toContain('vegan');
    expect(tags).toContain('low_sodium');
    expect(tags).toContain('quick');
    expect(tags).toContain('weeknight');
  });

  it('SHOULD remove searchTags when all tag arrays are empty', () => {
    const base = new URLSearchParams({ searchTags: 'vegan' });
    const result = applySmartSearchToParams(base, defaultOptions);
    expect(result.has('searchTags')).toBe(false);
  });

  it('SHOULD set the search param when options.search is a non-empty string', () => {
    const result = applySmartSearchToParams(new URLSearchParams(), {
      ...defaultOptions,
      search: 'pasta',
    });
    expect(result.get('search')).toBe('pasta');
  });

  it('SHOULD remove the search param when options.search is an empty string', () => {
    const base = new URLSearchParams({ search: 'pasta' });
    const result = applySmartSearchToParams(base, { ...defaultOptions, search: '' });
    expect(result.has('search')).toBe(false);
  });
});
