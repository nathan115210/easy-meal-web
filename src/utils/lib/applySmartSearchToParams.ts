import { SmartSearchOptionsState } from '@/utils/types/meals';
import { setOrDelete, syncArray } from '@/utils/lib/helpers';

/**
 * Apply smart search options into a copy of the provided URLSearchParams.
 *
 * Behavior:
 * - Starts from `baseParams` so existing query keys (e.g. `search=burger`) are preserved.
 * - For array fields (e.g. `mealType`) uses `syncArray` which appends repeated params
 *   and removes existing occurrences first.
 * - For scalar fields (strings/numbers/booleans) uses `setOrDelete` which sets the param
 *   when the value is meaningful and deletes it when value is empty or `"any"`.
 * - Returns a new `URLSearchParams` instance; `baseParams` is not mutated.
 *
 * @param baseParams - existing query params to start from
 * @param options - smart search options to apply
 * @returns a new URLSearchParams with the options applied
 */
export function applySmartSearchToParams(
  baseParams: URLSearchParams,
  options: SmartSearchOptionsState
): URLSearchParams {
  // Work on a shallow copy so we don't mutate the caller's URLSearchParams
  const params = new URLSearchParams(baseParams.toString());

  // Cast Object.entries to preserve option key/value typing for TypeScript.
  (
    Object.entries(options) as [
      keyof SmartSearchOptionsState,
      SmartSearchOptionsState[keyof SmartSearchOptionsState],
    ][]
  ).forEach(([key, value]) => {
    // Use a string key for URLSearchParams APIs
    const paramKey = key as string;

    // Arrays are synced as repeated params (or removed if empty/invalid)
    if (Array.isArray(value)) {
      syncArray(params, paramKey, value);
    } else {
      // Scalars (including strings/numbers/booleans) are set or deleted
      setOrDelete(params, paramKey, value as string | null | undefined);
    }
  });

  return params;
}
