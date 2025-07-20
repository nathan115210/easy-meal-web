'use server';

import { redirect } from 'next/navigation';

export default async function createMealAction(formData: FormData) {
  /*e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const json = await res.json();
    setForm({ title: '', slug: '', image: '', description: '', instructions: '', creator: '', creator_email: '' });
  } catch (err: any) {
    setError(err.message || 'An error occurred.');
  } finally {
    setLoading(false);
  }*/
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/meals`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    } else {
      redirect('/meals');
    }
  } catch (error) {
    console.error('Failed to create meal:', error);
    // Optionally, handle error (e.g., show error message)
  }
}
