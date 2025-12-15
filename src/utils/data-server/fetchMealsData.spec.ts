import { describe, it } from 'vitest';
import fetchMealsData from '@/utils/data-server/fetchMealsData';

describe('fetchMealsData', () => {
  const createSignal = () => new AbortController().signal;
  it('fetches the first page of the meals', async () => {
    const data = await fetchMealsData({
      signal: createSignal(),
    });

    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.total).toBe(data.items.length);
    expect(data.hasMore).toBe(false);
    // sanity check first item comes from mockMeals
    expect(data.items[0].slug).toBe('spicy-chicken-bowl');
  });

  it('applies search filter with single word via search param', async () => {
    const data = await fetchMealsData({
      signal: createSignal(),
      search: 'chicken',
    });

    expect(data.items).toHaveLength(1);
    expect(data.items[0].slug).toBe('spicy-chicken-bowl');
    expect(data.total).toBe(1);
    expect(data.hasMore).toBe(false);
  });

  it('applies search filter with multiple words via search param', async () => {
    const data = await fetchMealsData({
      signal: createSignal(),
      search: 'avocado Toast',
    });

    expect(data.items).toHaveLength(1);
    expect(data.items[0].slug).toBe('quick-avocado-toast');
    expect(data.total).toBe(1);
    expect(data.hasMore).toBe(false);
  });

  it('applies pagination via limit & pageParam (offset)', async () => {
    const page1 = await fetchMealsData({
      signal: createSignal(),
      limit: 2,
      pageParam: 0,
    });

    const page2 = await fetchMealsData({
      signal: createSignal(),
      limit: 2,
      pageParam: 2,
    });

    expect(page1.items).toHaveLength(2);
    expect(page1.hasMore).toBe(true);

    expect(page2.items.length).toBeGreaterThanOrEqual(1);
    expect(page2.items[0].slug).not.toBe(page1.items[0].slug);
  });
});
