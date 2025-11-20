import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getMealsData } from '@/utils/data-server/getMealsData';

export async function GET() {
  console.log('🔁 API HIT: /api/meals ', new Date().toLocaleTimeString());

  try {
    const data = await getMealsData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: create meal
export async function POST(req: Request) {
  const body = await req.json();
  //await createMealInDb(body);

  // Invalidate the cache for the meals list
  revalidateTag('meals:list', {});
  //  Ensure the page itself is revalidated
  revalidatePath('/all-meals');

  return NextResponse.json({ ok: true });
}
