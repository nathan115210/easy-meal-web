import styles from './page.module.scss';
import Image from 'next/image';
import React from 'react';
import { isValidIngredients } from '@/lib/utils/helpers';
import { Chip, ChipColor } from '@/components/Chip/Chip';
import { getMealBySlug } from '@/lib/data-server/meals';
import { notFound } from 'next/navigation';

export default async function MealDetail({ mealSlug }: { mealSlug: string }) {
  if (!mealSlug) return; // skip if no mealSlug provided

  const meal = await getMealBySlug(mealSlug);

  if (!meal) {
    notFound();
  }

  const { image, description, title, instructions, ingredients, creator, creator_email, category } =
    meal;
  const categories: string[] = normalizeCategories(category);

  return (
    <>
      <div className={styles.imageHeaderRow}>
        <div className={styles.imageWrapper}>
          <Image src={image} alt={title} fill className={styles.image} />
        </div>

        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.creator}>
            By <a href={`mailto:${creator_email}`}>{creator}</a>
          </p>
          <section className={styles.summary}>
            <p>{description}</p>
          </section>
          {categories.length > 0 && (
            <ul className={styles.categories}>
              {categories.map((item, index) => {
                const categoryColor: ChipColor = index % 1 === 0 ? 'primary' : 'secondary';
                const categoryLabel = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
                return (
                  <li key={`${categoryLabel}-${index}`} className={styles.categoryItem}>
                    <Chip label={categoryLabel} color={categoryColor} size="sm" />
                  </li>
                );
              })}
            </ul>
          )}
        </header>
      </div>

      {isValidIngredients(ingredients) && (
        <section className={styles.ingredients}>
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((ingredient) => {
              const key = `${ingredient.text}-${ingredient.amount}`;
              return (
                <li key={key} className={styles.ingredientItem}>
                  <span>{ingredient.text}</span>
                  <span>{ingredient.amount}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className={styles.instructions}>
        <h2>Instructions</h2>
        <ol>
          {instructions.map((instruction, index) => {
            const key = instruction.image
              ? `${instruction.image}-${instruction.text}`
              : instruction.text;
            return (
              <li key={key} className={styles.instructionItem}>
                {instruction.image && (
                  <div className={styles.instructionImageWrapper}>
                    <Image
                      src={instruction.image}
                      alt={`Instruction: ${instruction.text.slice(0, 40)}`}
                      width={100}
                      height={100}
                      className={styles.instructionImage}
                    />
                  </div>
                )}
                <div className={styles.instructionTextWrapper}>
                  <span className={styles.stepNumber}>Step {` ${index + 1}`}</span>
                  <p className={styles.instructionItemText}>{instruction.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

// helper

//Normalize and dedupe categories
function normalizeCategories(raw: string[] | null | undefined): string[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(
      raw
        .filter((c): c is string => typeof c === 'string')
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
    )
  );
}
