import { CookTimeValue } from '@/utils/types/meals';

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

/**
 * Set a query param when the provided value is present and not the literal "any".
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
