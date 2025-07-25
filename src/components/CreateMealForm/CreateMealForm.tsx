'use client';
import React, { useState, useTransition } from 'react';
import styles from './createMealForm.module.scss';
import { Meal } from '@/types/meals';
import Cta from '@/components/Cta/Cta';
import { CtaType } from '@/components/Cta/ctaType';
import ImagePicker from '@/components/ImagePicker/ImagePicker';
import { useRouter } from 'next/navigation';
import createMealAction from './createMealAction';

function CreateMealForm() {
  const [form, setForm] = useState<Omit<Meal, 'slug'>>({
    title: '',
    image: '',
    description: '',
    instructions: '',
    creator: '',
    creator_email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange<K extends keyof Meal>(field: K, value: string) {
    //TODO: use zod validation here
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const imageInput = e.currentTarget.elements.namedItem('image') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formData.set('image', imageInput.files[0]);
    }

    startTransition(async () => {
      try {
        await createMealAction(formData);
        //TODO: fix this cache thing
        /*  //revalidate the /meals path to ensure the new meal is reflected
          revalidatePath('/meals');*/
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

      <div className={styles.inlineFields}>
        {formFields.slice(0, 2).map(({ key, label, type }) => (
          <div key={key} className={styles.field}>
            <label htmlFor={key} className={styles.label}>
              {label}
            </label>
            <input id={key} name={key} type={type} value={form[key]} onChange={(e) => handleChange(key, e.target.value)} className={styles.input} required />
          </div>
        ))}
      </div>

      {formFields.slice(2).map(({ key, label, type }) => (
        <div key={key} className={styles.field}>
          <label htmlFor={key} className={styles.label}>
            {label}
          </label>
          {type === 'textarea' ? (
            <textarea id={key} name={key} value={form[key]} onChange={(e) => handleChange(key, e.target.value)} className={styles.textarea} required />
          ) : (
            <input id={key} name={key} type={type} value={form[key]} onChange={(e) => handleChange(key, e.target.value)} className={styles.input} required />
          )}
        </div>
      ))}

      <ImagePicker label={'Meal Image'} name={'image'} draggable />

      <Cta type={CtaType.Submit} className={styles.button} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Meal'}
      </Cta>
    </form>
  );
}

export default CreateMealForm;

const formFields = [
  { key: 'creator', label: 'Your Name', type: 'text' },
  { key: 'creator_email', label: 'Your Email', type: 'email' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'instructions', label: 'Instructions', type: 'textarea' },
] as const;