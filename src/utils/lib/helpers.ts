import { CaloriesValue, CookTimeValue } from '@/utils/types/meals';

/**
 * Convert a string to Title Case.
 * - Trims extra whitespace
 * - Uppercases first letter of each word
 * - Lowercases the rest
 *
 * Examples:
 *  "red panda" -> "Red Panda"
 *  "  beef "    -> "Beef"
 *  "lAMB shAnk" -> "Lamb Shank"
 */
export function titleCase(str: string): string {
  if (!str) return '';

  return str
    .trim()
    .split(/\s+/) // split on any amount of spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function underscoreToTitle(str: string): string {
  if (!str) return '';
  const withSpaces = str.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();
  return titleCase(withSpaces);
}
export function mapCookTimeToBounds(cookTime: CookTimeValue | undefined): {
  cookTimeMin: number | null;
  cookTimeMax: number | null;
} {
  switch (cookTime) {
    case CookTimeValue.Under15:
      return { cookTimeMin: null, cookTimeMax: 15 };
    case CookTimeValue.Under30:
      return { cookTimeMin: null, cookTimeMax: 30 };
    case CookTimeValue.Under45:
      return { cookTimeMin: null, cookTimeMax: 45 };
    case CookTimeValue.Under60:
      return { cookTimeMin: null, cookTimeMax: 60 };
    case CookTimeValue.Over60:
      return { cookTimeMin: 61, cookTimeMax: null }; // or 60 depending on how you define it
    case CookTimeValue.Any:
    default:
      return { cookTimeMin: null, cookTimeMax: null };
  }
}

export function mapCalorieStringToNumber(calories: CaloriesValue | undefined): number | null {
  switch (calories) {
    case CaloriesValue.Under400:
      return 400;
    case CaloriesValue.Under600:
      return 600;
    case CaloriesValue.Under800:
      return 800;
    case CaloriesValue.Any:
    default:
      return null;
  }
}

/**
 * Set a query param when the provided value is§ present and not the literal "any".
 * Otherwise delete the param from the URLSearchParams.
 *
 * Notes:
 * - The check for `"any"` is exact (case-sensitive) to match existing code behavior.
 * - Empty strings and `null`/`undefined` remove the param.
 *
 * Example:
 *  setOrDelete(params, 'cookTime', 'under_30') // sets cookTime=under_30
 *  setOrDelete(params, 'cookTime', 'any')     // deletes cookTime
 */
export const setOrDelete = (
  params: URLSearchParams,
  key: string,
  value: string | null | undefined
) => {
  if (value && value !== 'any' && value !== '') {
    params.set(key, value);
  } else {
    params.delete(key);
  }
};

/**
 * Sync an array field into URLSearchParams as repeated params.
 * - Removes any existing occurrences of `key` first.
 * - Appends each non-empty, non-`"any"` item.
 *
 * Notes:
 * - The `"any"` check is exact (case-sensitive) to preserve current logic.
 * - Items are appended as separate params: `?mealType=dinner&mealType=snacks`.
 *
 * Example:
 *  syncArray(params, 'mealType', ['dinner', 'snacks'])
 *  // results in mealType=dinner & mealType=snacks
 */
export const syncArray = (params: URLSearchParams, key: string, values: string[]) => {
  params.delete(key);
  if (values.length > 0) {
    values.forEach((v) => {
      if (v && v !== 'any') {
        params.append(key, v);
      }
    });
  }
};

/**
 * Convert a title string into a URL-friendly slug.
 *
 * Rules:
 * - Lowercases the entire string
 * - Trims leading/trailing whitespace
 * - Replaces any sequence of non-alphanumeric characters with a single dash (-)
 * - Removes leading/trailing dashes
 *
 * Examples:
 *  slugify('Juicy Cheese Burger')       => 'juicy-cheese-burger'
 *  slugify('  Ma Po Dou Fu  ')          => 'ma-po-dou-fu'
 *  slugify('Fish & Chips!!')            => 'fish-chips'
 *  slugify('Taco\tTuesday\nSpecials')  => 'taco-tuesday-specials'
 */
export function slugify(title: string): string {
  return normalizeString(title)
    .replace(/[^a-z0-9]+/g, '-') // replace spaces & special chars
    .replace(/(^-|-$)+/g, ''); // trim leading/trailing -
}

export const normalizeString = (s: string): string => s.trim().toLowerCase();

export function stringToArray(str: string): string[] {
  return normalizeString(str)
    .split(' ')
    .filter((item) => item.length > 0);
}

export function arrayToString(arr?: string | string[]): string {
  if (arr === undefined) {
    return '';
  }
  if (!Array.isArray(arr)) return arr;
  return arr.map((item: string) => normalizeString(item)).join(' ');
}

export function hasAnyOverlap(arr1: readonly string[], arr2: readonly string[]): boolean {
  if (arr1.length === 0 || arr2.length === 0) return false;

  const [small, big] = arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
  const set = new Set(small);

  for (const item of big) {
    if (set.has(normalizeString(item))) return true;
  }

  return false;
}
