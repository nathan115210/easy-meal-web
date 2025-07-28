'use client';
import React, { useState, useTransition } from 'react';
import styles from './createMealForm.module.scss';
import { Meal, MealIngredient } from '@/types/meals';
import Cta from '@/components/Cta/Cta';
import { CtaType } from '@/components/Cta/ctaType';
import ImagePicker from '@/components/ImagePicker/ImagePicker';
import { useRouter } from 'next/navigation';
import createMealAction from './createMealAction';
import SortableList from '@/components/SortableList/SortableList';

function CreateMealForm() {
  const [form, setForm] = useState<Omit<Meal, 'slug'>>({
    title: '',
    image: '',
    description: '',
    instructions: '',
    ingredients: [{ text: '', amount: '' }],
    creator: '',
    creator_email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange<K extends keyof Meal>(field: K, value: string | MealIngredient[]) {
    //TODO: use zod validation here
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // set image in formData
    const imageInput = e.currentTarget.elements.namedItem('image') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formData.set('image', imageInput.files[0]);
    }

    if (isValidIngredients(form.ingredients)) {
      // Set ingredients in formData
      formData.set('ingredients', JSON.stringify(form.ingredients));
    } else {
      setError('Please provide valid ingredients with text and amount.');
      return;
    }

    startTransition(async () => {
      try {
        await createMealAction(formData);
        //TODO: fix this cache thing
        /*  //revalidate the /meals path to ensure the new meal is reflected
          revalidatePath('/meals');*/
        //TODO: add back before merge
        router.push('/meals');
      } catch (error) {
        console.error('Error during form submission:', error);
        setError('An error occurred while submitting the form.');
      }
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add a New Meal</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/*//TODO: Prefill the user info from user information if login*/}
      <div className={styles.inlineFields}>
        {creatorInfoFields.slice(0, 2).map(({ key, label, type }) => (
          <div key={key} className={styles.field}>
            <label htmlFor={key} className={styles.label}>
              {label}
            </label>
            <input id={key} name={key} type={type} value={form[key]} onChange={(e) => handleChange(key, e.target.value)} className={styles.input} required />
          </div>
        ))}
      </div>

      <div key={'title'} className={styles.field}>
        <label htmlFor={'title'} className={styles.label}>
          Title
        </label>
        <input id={'title'} name={'title'} type={'text'} value={form['title']} onChange={(e) => handleChange('title', e.target.value)} className={styles.input} required />
      </div>

      <div className={styles.field}>
        <label htmlFor={'description'} className={styles.label}>
          Description
        </label>
        <textarea id={'description'} name={'description'} value={form['description']} onChange={(e) => handleChange('description', e.target.value)} className={styles.input} required />
      </div>

      <div>
        <label htmlFor={'intendeds'} className={styles.label}>
          Intendeds
        </label>
        <SortableList id={'intendeds'} onChange={(ingredients) => handleChange('ingredients', ingredients)} />
      </div>

      <div className={styles.field}>
        <label htmlFor={'instructions'} className={styles.label}>
          Instructions
        </label>
        <textarea id={'instructions'} name={'instructions'} value={form['instructions']} onChange={(e) => handleChange('instructions', e.target.value)} className={styles.input} required />
      </div>

      <ImagePicker label={'Meal Image'} name={'image'} draggable />

      <Cta type={CtaType.Submit} className={styles.button} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Meal'}
      </Cta>
    </form>
  );
}

export default CreateMealForm;

const creatorInfoFields = [
  { key: 'creator', label: 'Your Name', type: 'text' },
  { key: 'creator_email', label: 'Your Email', type: 'email' },
] as const;

// Helpers

export const isValidIngredients = (ingredients: MealIngredient[]) => {
  // Check if ingredients array is valid
  if (!Array.isArray(ingredients) || ingredients.length === 0) return false;
  // Check if each ingredient has non-empty text and amount
  return ingredients.every((ingredient) => ingredient.text.trim() !== '' && ingredient.amount.trim() !== '');
};