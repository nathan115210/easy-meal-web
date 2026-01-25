'use client';

import { MealIngredient } from '@/utils/types/meals';
import styles from './ingredients.module.scss';
import Button from '@/components/button/Button';
import { useEffect, useMemo, useState } from 'react';
import { ListChecks, Minus, Plus } from 'lucide-react';

type IngredientsProps = {
  mealSlug: string; // IMPORTANT for per-meal persistence
  ingredients: MealIngredient[];
};

const SERVING_STORAGE_PREFIX = 'easy-meal:serving:';

/**
 * Parse + scale helpers
 * Designed for "best-effort" scaling while preserving units and text.
 */

const UNICODE_FRACTIONS: Record<string, number> = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅐': 1 / 7,
  '⅑': 1 / 9,
  '⅒': 0.1,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅕': 0.2,
  '⅖': 0.4,
  '⅗': 0.6,
  '⅘': 0.8,
  '⅙': 1 / 6,
  '⅚': 5 / 6,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

function normalizeAmountInput(input: string): string {
  return input.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
}

function parseSimpleNumberToken(token: string): number | null {
  if (!token) return null;

  if (token in UNICODE_FRACTIONS) return UNICODE_FRACTIONS[token];

  if (/^\d+\/\d+$/.test(token)) {
    const [a, b] = token.split('/');
    const denom = Number(b);
    if (!denom) return null;
    return Number(a) / denom;
  }

  if (/^\d+(\.\d+)?$/.test(token)) return Number(token);

  return null;
}

function parseQuantityPrefix(
  raw: string
): { quantity: number | [number, number]; rest: string } | null {
  const s = normalizeAmountInput(raw);

  const rangeMatch = s.match(/^(\S+)\s*-\s*(\S+)\s*(.*)$/);
  if (rangeMatch) {
    const left = parseSimpleNumberToken(rangeMatch[1]);
    const right = parseSimpleNumberToken(rangeMatch[2]);
    if (left != null && right != null) {
      return { quantity: [left, right], rest: rangeMatch[3].trim() };
    }
  }

  const mixedMatch = s.match(/^(\S+)\s+(\S+)\s*(.*)$/);
  if (mixedMatch) {
    const whole = parseSimpleNumberToken(mixedMatch[1]);
    const frac = parseSimpleNumberToken(mixedMatch[2]);
    if (whole != null && frac != null) {
      return { quantity: whole + frac, rest: mixedMatch[3].trim() };
    }
  }

  const singleMatch = s.match(/^(\S+)\s*(.*)$/);
  if (singleMatch) {
    const n = parseSimpleNumberToken(singleMatch[1]);
    if (n != null) {
      return { quantity: n, rest: singleMatch[2].trim() };
    }
  }

  return null;
}

function formatNumber(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

function scaleAmountString(amount: string, serving: number): string {
  const normalized = normalizeAmountInput(amount);

  const lower = normalized.toLowerCase();
  if (
    lower.includes('to taste') ||
    lower.includes('as needed') ||
    lower.includes('optional') ||
    lower.includes('a pinch') ||
    lower.includes('to serve') ||
    lower === 'taste'
  ) {
    return amount;
  }

  const parsed = parseQuantityPrefix(normalized);
  if (!parsed) return amount;

  if (Array.isArray(parsed.quantity)) {
    const [a, b] = parsed.quantity;
    const scaledA = a * serving;
    const scaledB = b * serving;
    const range = `${formatNumber(scaledA)}-${formatNumber(scaledB)}`;
    return parsed.rest ? `${range} ${parsed.rest}` : range;
  }

  const scaled = parsed.quantity * serving;
  const qty = formatNumber(scaled);
  return parsed.rest ? `${qty} ${parsed.rest}` : qty;
}

/**  Cache read for initial state (no setState-in-effect) */
function getInitialServing(mealSlug: string): number {
  if (typeof window === 'undefined') return 1;

  const key = `${SERVING_STORAGE_PREFIX}${mealSlug}`;
  const raw = window.localStorage.getItem(key);
  const n = raw ? Number(raw) : NaN;

  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function Ingredients({ mealSlug, ingredients }: IngredientsProps) {
  /**  Initialize from cache immediately; fallback to 1 */
  const [serving, setServing] = useState<number>(() => getInitialServing(mealSlug));

  const ingredientsCount = ingredients?.length ?? 0;

  /**  Persist serving on change */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `${SERVING_STORAGE_PREFIX}${mealSlug}`;
    window.localStorage.setItem(key, String(serving));
  }, [mealSlug, serving]);

  const scaledIngredients = useMemo(() => {
    return ingredients.map((ing) => ({
      ...ing,
      scaledAmount: scaleAmountString(ing.amount, serving),
    }));
  }, [ingredients, serving]);

  if (!ingredients || ingredientsCount === 0) return null;

  return (
    <div data-testid="meal-details-Ingredients" className={styles.ingredients}>
      <div className={styles.header}>
        <h3 className={styles.heading}>
          <ListChecks size={24} aria-hidden={true} />
          {`Ingredients (${ingredientsCount})`}
        </h3>

        <div className={styles.convertorContainer}>
          <Button iconOnly onClick={() => setServing((s) => s + 1)} aria-label="Increase servings">
            <Plus size={24} />
          </Button>

          <span className={styles.servingCount}>{serving}</span>

          <Button
            disabled={serving === 1}
            iconOnly
            onClick={() => setServing((s) => Math.max(1, s - 1))}
            aria-label="Decrease servings"
          >
            <Minus size={24} />
          </Button>
        </div>
      </div>

      <ul className={styles.ingredientsList}>
        {scaledIngredients.map((item, index) => (
          <li key={`${item.text}-${index}`}>
            <span className={styles.ingredientText}>{item.text}</span>
            <span className={styles.ingredientAmount}>{item.scaledAmount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ingredients;
