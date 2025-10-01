import type { Meal } from '@/types/meals';

export async function getMealsBySlugsClient(slugs: string[]): Promise<Meal[]> {
  if (!Array.isArray(slugs) || slugs.length === 0) return [];
  const res = await fetch('/api/meals/by-slugs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slugs }),
  });
  if (!res.ok) throw new Error('Failed to fetch meals by slugs');
  return (await res.json()) as Meal[];
}
