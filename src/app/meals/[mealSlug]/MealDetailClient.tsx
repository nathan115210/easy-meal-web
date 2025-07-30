'use client';

import { Meal } from '@/types/meals';
import { useQuery } from '@tanstack/react-query';
import styles from './page.module.scss';
import Image from 'next/image';
import MealDetailSkeleton from '@/components/LoadingCmponents/LoadingMealDetails/LoadingMealDetails';
import { notFound } from 'next/navigation';
import React from 'react';
import { isValidIngredients } from '@/lib/utils/helpers';

async function getMealBySlug(slug: string): Promise<Meal> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meals/${slug}`);

  if (!res.ok) throw new Error(`Failed to fetch meal with slug: ${slug}`);
  const jsonData = await res.json();

  if (!jsonData.meal) throw new Error(`Meal with slug "${slug}" not found`);
  return jsonData.meal as Meal;
}

export default function MealDetailClient({ mealSlug }: { mealSlug: string }) {
  const {
    data: meal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meal', mealSlug],
    queryFn: () => getMealBySlug(mealSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes freshness
    refetchOnWindowFocus: false,
    retry: false,
  });
  if (isLoading) return <MealDetailSkeleton />;
  if (error) {
    console.error('Error fetching meal:', error);
    notFound();

    return null;
  }
  if (!meal) return null;
  const { image, description, title, instructions, ingredients, creator, creator_email } = meal;
  console.log('instructions', instructions);
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
        </header>
      </div>
      {isValidIngredients(ingredients) && (
        <section className={styles.ingredients}>
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index} className={styles.ingredientItem}>
                <span>{ingredient.text}</span>
                <span>{ingredient.amount}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className={styles.instructions}>
        <h2>Instructions</h2>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={index} className={styles.instructionItem}>
              {instruction.image && (
                <div className={styles.instructionImageWrapper}>
                  <Image src={instruction.image} alt={`Step ${index + 1}`} width={100} height={100} className={styles.instructionImage} />
                </div>
              )}
              <div className={styles.instructionTextWrapper}>
                <span className={styles.stepNumber}>Step {index + 1}</span>
                <p className={styles.instructionItemText}>{instruction.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/*TODO: add recommened meal*/}
    </>
  );
}