'use client';

import { useCallback, useEffect, useState } from 'react';
import { CookTimeValue, SmartSearchOptionsState } from '@/utils/types/meals';

export const DEFAULT_SMART_OPTIONS: SmartSearchOptionsState = {
  existIngredients: [],
  excludeIngredients: [],
  cookTime: CookTimeValue.Any,
  maxCalories: 'any',
  difficultyLevel: 'any',
  dietaryPreferences: [],
  mealType: [],
  specialTags: [],
  occasionTags: [],
  healthTags: [],
};

type UseSmartSearchOptionsArgs = {
  initial?: Partial<SmartSearchOptionsState>;
};

export type UpdateOptionFn = <K extends keyof SmartSearchOptionsState>(
  key: K,
  value: SmartSearchOptionsState[K]
) => void;

export type ClearOptionFn = (key: keyof SmartSearchOptionsState) => void;

const storageKey = 'easy-meal:smart-search';

export default function useSmartSearchOptions(args: UseSmartSearchOptionsArgs = {}) {
  const { initial } = args;

  const [options, setOptions] = useState<SmartSearchOptionsState>({
    ...DEFAULT_SMART_OPTIONS,
    ...initial,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<SmartSearchOptionsState>;

      // Avoid synchronous setState in effect — use microtask
      queueMicrotask(() => {
        setOptions((prev) => ({
          ...prev,
          ...parsed,
        }));
      });
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage when options change (client only)
  useEffect(() => {
    if (!storageKey) return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(options));
    } catch {
      // ignore
    }
  }, [options]);

  const updateOption = useCallback<UpdateOptionFn>((key, value) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearOption = useCallback<ClearOptionFn>((key) => {
    setOptions((prev) => {
      const current = prev[key];
      const clearedValue = Array.isArray(current) ? [] : 'any';
      return {
        ...prev,
        [key]: clearedValue as never,
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setOptions(DEFAULT_SMART_OPTIONS);
  }, []);

  return {
    options,
    updateOption,
    clearOption,
    resetAll,
    setOptions,
  };
}
