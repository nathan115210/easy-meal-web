'use server';
import { revalidatePath } from 'next/cache';

export default async function createMealAction(formData: FormData) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/meals`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    // Revalidate the /meals page so the new meal appears immediately
    revalidatePath('/meals');
  } catch (error) {
    console.error('Failed to create meal:', error);
    // Optionally, handle error (e.g., show error message)
  }
}
