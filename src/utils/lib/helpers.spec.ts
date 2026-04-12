import { describe, expect, it } from 'vitest';
import {
  arrayToString,
  hasAnyOverlap,
  mapCalorieStringToNumber,
  mapCookTimeToBounds,
  normalizeString,
  setOrDelete,
  slugify,
  stringToArray,
  syncArray,
  titleCase,
  underscoreToTitle,
} from './helpers';
import { CaloriesValue, CookTimeValue } from '@/utils/types/meals';

// ─── titleCase ────────────────────────────────────────────────────────────────

describe('titleCase', () => {
  it('SHOULD capitalise the first letter of each word', () => {
    expect(titleCase('red panda')).toBe('Red Panda');
  });

  it('SHOULD trim surrounding whitespace before converting', () => {
    expect(titleCase('  beef ')).toBe('Beef');
  });

  it('SHOULD lowercase the non-initial letters of each word', () => {
    expect(titleCase('lAMB shAnk')).toBe('Lamb Shank');
  });

  it('SHOULD return an empty string when given an empty string', () => {
    expect(titleCase('')).toBe('');
  });
});

// ─── underscoreToTitle ────────────────────────────────────────────────────────

describe('underscoreToTitle', () => {
  it('SHOULD replace underscores with spaces and title-case the result', () => {
    expect(underscoreToTitle('high_protein')).toBe('High Protein');
  });

  it('SHOULD handle multiple consecutive underscores', () => {
    expect(underscoreToTitle('one__pot')).toBe('One Pot');
  });

  it('SHOULD return an empty string when given an empty string', () => {
    expect(underscoreToTitle('')).toBe('');
  });
});

// ─── slugify ─────────────────────────────────────────────────────────────────

describe('slugify', () => {
  it('SHOULD convert a title with spaces to a hyphenated lowercase slug', () => {
    expect(slugify('Juicy Cheese Burger')).toBe('juicy-cheese-burger');
  });

  it('SHOULD trim leading and trailing whitespace before slugifying', () => {
    expect(slugify('  Ma Po Dou Fu  ')).toBe('ma-po-dou-fu');
  });

  it('SHOULD replace special characters with a single hyphen', () => {
    expect(slugify('Fish & Chips!!')).toBe('fish-chips');
  });

  it('SHOULD replace tab and newline characters with hyphens', () => {
    expect(slugify('Taco\tTuesday\nSpecials')).toBe('taco-tuesday-specials');
  });

  it('SHOULD not produce leading or trailing hyphens', () => {
    const result = slugify('!Hello World!');
    expect(result.startsWith('-')).toBe(false);
    expect(result.endsWith('-')).toBe(false);
  });
});

// ─── normalizeString ──────────────────────────────────────────────────────────

describe('normalizeString', () => {
  it('SHOULD trim whitespace and convert to lowercase', () => {
    expect(normalizeString('  Vegan  ')).toBe('vegan');
  });

  it('SHOULD preserve hyphens when lowercasing', () => {
    expect(normalizeString('Gluten-Free')).toBe('gluten-free');
  });

  it('SHOULD return an empty string for a whitespace-only string', () => {
    expect(normalizeString('   ')).toBe('');
  });
});

// ─── stringToArray ───────────────────────────────────────────────────────────

describe('stringToArray', () => {
  it('SHOULD split a space-separated string into a normalised array', () => {
    expect(stringToArray('chicken beef')).toEqual(['chicken', 'beef']);
  });

  it('SHOULD trim and lowercase each word', () => {
    expect(stringToArray('  Vegan   Gluten-Free ')).toEqual(['vegan', 'gluten-free']);
  });

  it('SHOULD return an empty array for an empty string', () => {
    expect(stringToArray('')).toEqual([]);
  });

  it('SHOULD return an empty array for a whitespace-only string', () => {
    expect(stringToArray('   ')).toEqual([]);
  });
});

// ─── arrayToString ───────────────────────────────────────────────────────────

describe('arrayToString', () => {
  it('SHOULD join and normalise an array of strings', () => {
    expect(arrayToString(['Vegan', 'Gluten-Free'])).toBe('vegan gluten-free');
  });

  it('SHOULD pass through a single string without normalising', () => {
    expect(arrayToString('chicken')).toBe('chicken');
  });

  it('SHOULD return an empty string for undefined input', () => {
    expect(arrayToString(undefined)).toBe('');
  });

  it('SHOULD return an empty string for an empty array', () => {
    expect(arrayToString([])).toBe('');
  });
});

// ─── hasAnyOverlap ────────────────────────────────────────────────────────────

describe('hasAnyOverlap', () => {
  it('SHOULD return true when at least one normalised element exists in both arrays', () => {
    expect(hasAnyOverlap(['Vegan', 'Gluten-Free'], ['vegan', 'paleo'])).toBe(true);
  });

  it('SHOULD return false when there is no common normalised element', () => {
    expect(hasAnyOverlap(['beef', 'pork'], ['chicken', 'fish'])).toBe(false);
  });

  it('SHOULD perform a case-insensitive comparison', () => {
    expect(hasAnyOverlap(['DAIRY'], ['  dairy  '])).toBe(true);
  });

  it('SHOULD return false when either array is empty', () => {
    expect(hasAnyOverlap([], ['anything'])).toBe(false);
    expect(hasAnyOverlap(['anything'], [])).toBe(false);
  });
});

// ─── setOrDelete ─────────────────────────────────────────────────────────────

describe('setOrDelete', () => {
  it('SHOULD set the param when the value is a non-empty string that is not "any"', () => {
    const params = new URLSearchParams();
    setOrDelete(params, 'cookTime', 'under_30');
    expect(params.get('cookTime')).toBe('under_30');
  });

  it('SHOULD delete the param when the value is "any"', () => {
    const params = new URLSearchParams({ cookTime: 'under_30' });
    setOrDelete(params, 'cookTime', 'any');
    expect(params.has('cookTime')).toBe(false);
  });

  it('SHOULD delete the param when the value is an empty string', () => {
    const params = new URLSearchParams({ search: 'pasta' });
    setOrDelete(params, 'search', '');
    expect(params.has('search')).toBe(false);
  });

  it('SHOULD delete the param when the value is null', () => {
    const params = new URLSearchParams({ key: 'value' });
    setOrDelete(params, 'key', null);
    expect(params.has('key')).toBe(false);
  });

  it('SHOULD delete the param when the value is undefined', () => {
    const params = new URLSearchParams({ key: 'value' });
    setOrDelete(params, 'key', undefined);
    expect(params.has('key')).toBe(false);
  });
});

// ─── syncArray ───────────────────────────────────────────────────────────────

describe('syncArray', () => {
  it('SHOULD append each value as a separate param', () => {
    const params = new URLSearchParams();
    syncArray(params, 'mealType', ['dinner', 'snacks']);
    expect(params.getAll('mealType')).toEqual(['dinner', 'snacks']);
  });

  it('SHOULD remove an existing param before appending new values', () => {
    const params = new URLSearchParams({ mealType: 'lunch' });
    syncArray(params, 'mealType', ['dinner']);
    expect(params.getAll('mealType')).toEqual(['dinner']);
  });

  it('SHOULD remove the param entirely when the values array is empty', () => {
    const params = new URLSearchParams({ mealType: 'lunch' });
    syncArray(params, 'mealType', []);
    expect(params.has('mealType')).toBe(false);
  });

  it('SHOULD skip values that are "any"', () => {
    const params = new URLSearchParams();
    syncArray(params, 'mealType', ['any', 'dinner']);
    expect(params.getAll('mealType')).toEqual(['dinner']);
  });
});

// ─── mapCookTimeToBounds ─────────────────────────────────────────────────────

describe('mapCookTimeToBounds', () => {
  it('SHOULD return max=15 with no min for Under15', () => {
    expect(mapCookTimeToBounds(CookTimeValue.Under15)).toEqual({
      cookTimeMin: null,
      cookTimeMax: 15,
    });
  });

  it('SHOULD return max=30 with no min for Under30', () => {
    expect(mapCookTimeToBounds(CookTimeValue.Under30)).toEqual({
      cookTimeMin: null,
      cookTimeMax: 30,
    });
  });

  it('SHOULD return min=61 with no max for Over60', () => {
    expect(mapCookTimeToBounds(CookTimeValue.Over60)).toEqual({
      cookTimeMin: 61,
      cookTimeMax: null,
    });
  });

  it('SHOULD return both null for Any', () => {
    expect(mapCookTimeToBounds(CookTimeValue.Any)).toEqual({
      cookTimeMin: null,
      cookTimeMax: null,
    });
  });

  it('SHOULD return both null for undefined', () => {
    expect(mapCookTimeToBounds(undefined)).toEqual({ cookTimeMin: null, cookTimeMax: null });
  });
});

// ─── mapCalorieStringToNumber ────────────────────────────────────────────────

describe('mapCalorieStringToNumber', () => {
  it('SHOULD return 400 for Under400', () => {
    expect(mapCalorieStringToNumber(CaloriesValue.Under400)).toBe(400);
  });

  it('SHOULD return 600 for Under600', () => {
    expect(mapCalorieStringToNumber(CaloriesValue.Under600)).toBe(600);
  });

  it('SHOULD return 800 for Under800', () => {
    expect(mapCalorieStringToNumber(CaloriesValue.Under800)).toBe(800);
  });

  it('SHOULD return null for Any', () => {
    expect(mapCalorieStringToNumber(CaloriesValue.Any)).toBeNull();
  });

  it('SHOULD return null for undefined', () => {
    expect(mapCalorieStringToNumber(undefined)).toBeNull();
  });
});
