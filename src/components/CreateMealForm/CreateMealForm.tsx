'use client';
import React, { useState } from 'react';
import styles from './createMealForm.module.scss';
import { Meal } from '@/types/meals';
import Cta from '@/components/Cta/Cta';
import { CtaType } from '@/components/Cta/ctaType';
import ImagePicker from '@/components/ImagePicker/ImagePicker';
import { useRouter } from 'next/navigation';

function CreateMealForm() {
  const [form, setForm] = useState<Omit<Meal, 'slug'>>({
    title: '',
    image: '',
    description: '',
    instructions: '',
    creator: '',
    creator_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleChange<K extends keyof Meal>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Ensure image is a File
    const imageInput = e.currentTarget.elements.namedItem('image') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
      formData.set('image', imageInput.files[0]);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
      const res = await fetch(`${baseUrl}/api/meals`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      setForm({
        title: '',
        image: '',
        description: '',
        instructions: '',
        creator: '',
        creator_email: '',
      });

      router.push('/meals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the meal.');
    } finally {
      setLoading(false);
    }
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
          {}
          {type === 'textarea' ? (
            <textarea id={key} name={key} value={form[key]} onChange={(e) => handleChange(key, e.target.value)} className={styles.textarea} required />
          ) : (
            <input id={key} name={key} type={type} value={form[key]} onChange={(e) => handleChange(key, e.target.value)} className={styles.input} required />
          )}
        </div>
      ))}

      <ImagePicker label={'Meal Image'} name={'image'} draggable />

      <Cta type={CtaType.Submit} className={styles.button} disabled={loading}>
        {loading ? 'Saving...' : 'Save Meal'}
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
