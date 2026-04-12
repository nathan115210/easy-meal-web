import { expect, test } from '@playwright/test';
import { e2eResponsePromise } from '@/utils/test/e2e-test/helpers';

test.describe('Smart Search – filter → URL → results', () => {
  test('shows meal cards after navigating to /smart-search', async ({ page }) => {
    /*
     * Flow:
     * 1. Navigate to /smart-search.
     * 2. Wait for the initial all-meals query to complete.
     * 3. Assert that at least one meal-card is visible.
     */

    const responsePromise = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/smart-search');

    await responsePromise;

    const mealCards = page.getByTestId('meal-card');
    await expect(mealCards.first()).toBeVisible();

    const count = await mealCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('updates the URL with mealType param and filters results when a meal type chip is selected', async ({
    page,
  }) => {
    /*
     * Flow:
     * 1. Navigate to /smart-search and wait for initial load.
     * 2. Click the "Dinner" chip in the Meal Types filter group.
     * 3. Click the "Search" button.
     * 4. Wait for the URL to reflect mealType=dinner.
     * 5. Wait for the results query to complete.
     * 6. Assert meal cards are visible.
     */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/smart-search');
    await initialLoad;

    // Select "Dinner" chip from the Meal Types multi-select group
    const dinnerChip = page.getByRole('group', { name: /meal types/i }).getByText('Dinner');
    await dinnerChip.click();

    // Click the Search button
    const searchButton = page.getByRole('button', { name: /^search$/i });
    const searchLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');
    await searchButton.click();

    // 4) Wait for URL update
    await page.waitForURL((url) => url.searchParams.has('mealType'));

    const url = new URL(page.url());
    expect(url.searchParams.getAll('mealType')).toContain('dinner');

    // 5) Wait for results query
    await searchLoad;

    // 6) Assert results are present
    const mealCards = page.getByTestId('meal-card');
    await expect(mealCards.first()).toBeVisible();
  });

  test('resets results and clears URL params when Reset is clicked', async ({ page }) => {
    /*
     * Flow:
     * 1. Navigate to /smart-search?mealType=dinner with results loaded.
     * 2. Click the Reset button.
     * 3. Wait for URL to lose the mealType param.
     * 4. Wait for all-meals query triggered by the URL change.
     * 5. Assert more results are shown (unfiltered).
     */

    const filteredLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/smart-search?mealType=dinner');
    await filteredLoad;

    const filteredCount = await page.getByTestId('meal-card').count();

    // Click Reset
    const resetButton = page.getByRole('button', { name: /^reset$/i });
    await resetButton.click();

    await page.waitForURL((url) => !url.searchParams.has('mealType'));

    const restoredLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');
    await restoredLoad;

    const restoredCount = await page.getByTestId('meal-card').count();
    expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('shows empty state for a search term that matches no meals', async ({ page }) => {
    /*
     * Flow:
     * 1. Navigate to /smart-search?search=xyzzy_no_match.
     * 2. Wait for the query to resolve.
     * 3. Assert zero meal-card elements are present.
     * 4. Assert the empty-list element is visible.
     */

    const loadPromise = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/smart-search?search=xyzzy_no_match');
    await loadPromise;

    const mealCards = page.getByTestId('meal-card');
    expect(await mealCards.count()).toBe(0);

    await expect(page.getByTestId('meals-empty-list')).toBeVisible();
  });
});
