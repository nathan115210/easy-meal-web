import slugify from 'slugify';
import pinyin from 'pinyin';
import type { MealIngredient } from '@/types/meals';

export const convertSlugToTitle = (slug: string): string => {
  // Convert slug to title by replacing hyphens with spaces and capitalizing each word
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const convertStrToSlug = (inputStr: string): string => {
  let str = inputStr;

  //Try to convert Chinese to pinyin, only if contains Chinese
  const hasChinese = /[\u4e00-\u9fa5]/.test(inputStr);
  if (hasChinese) {
    const chinesePinyin = pinyin(inputStr, {
      style: pinyin.STYLE_NORMAL,
    })
      .flat()
      .join(' ');
    str = chinesePinyin;
  }

  //Slugify the result (removes symbols, accents, spaces)
  let slug = slugify(str, {
    lower: true,
    strict: true, // remove punctuation/symbols
    locale: 'en', // works well with accents
    trim: true,
    remove: /[*+~.()'"!:@]/g, // remove specific characters
  });

  // 3. Fallback to timestamp if slug is empty
  if (!slug) {
    slug = `slug-${Date.now()}`;
  }

  return slug;
};

export const isValidIngredients = (ingredients: unknown[]): Boolean => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) return false;
  return ingredients.every((ingredient) => {
    let obj = ingredient;
    if (typeof ingredient === 'string') return false;
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof (obj as MealIngredient).text === 'string' &&
      (obj as MealIngredient).text.trim() !== '' &&
      typeof (obj as MealIngredient).amount === 'string' &&
      (obj as MealIngredient).amount.trim() !== ''
    );
  });
};