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
