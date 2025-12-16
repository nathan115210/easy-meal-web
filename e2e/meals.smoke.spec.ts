import { expect, test } from '@playwright/test';
import { e2eResponsePromise } from '@/utils/test/e2e-test/helpers';

test.describe('Meals page – base rendering', () => {
  test('shows skeleton while loading and then renders meal cards', async ({ page }) => {
    /*
    * Flow:
      1. Navigate to `/meals`.
      2. Wait for the query to finish:
          - Wait until `cards-list-skeleton` is **not** visible / detached.
      3. After loading:
        - Expect `meals-infinite-list` to be visible.
        - Expect at least 1 element with `data-testid="meal-card"`.
    * */

    const responsePromise = e2eResponsePromise(page, '/api/all-meals', 'POST');

    // 1) Navigate to `/meals`.
    await page.goto('/meals');

    // 2) Wait for the GraphQL POST to complete
    await responsePromise;

    // 3)  wait for DOM to reflect the loaded state
    await expect(page.getByTestId('meals-infinite-list')).toBeVisible();

    const mealCards = page.getByTestId('meal-card');
    await expect(mealCards.first()).toBeVisible();

    await expect(page.getByTestId('cards-list-skeleton')).toHaveCount(0);

    const cardsCount = await mealCards.count();
    expect(cardsCount).toBeGreaterThan(0);
  });

  test('loads additional meals when scrolling to the watcher', async ({ page }) => {
    /*
    * Flow:
      1. Go to `/meals`.
      2. Wait for initial load to complete:
          - Ensure skeleton is gone.
          - Count current `meal-card` elements (store `initialCount`).
      3. Scroll down until `infinite-scroll-watcher` is in view and wait for the load it triggers.
      4. Re-count `meal-card` elements.
    * */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals');
    await initialLoad;

    const mealCards = page.getByTestId('meal-card');
    const initialCount = await mealCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // 3) Scroll down until `infinite-scroll-watcher` is in view:
    const scrollWatcher = page.getByTestId('infinite-scroll-watcher');

    // Prepare a wait for the *next* request that loads more items
    const loadMorePromise = e2eResponsePromise(page, '/api/all-meals', 'POST');

    // Trigger the load
    await scrollWatcher.scrollIntoViewIfNeeded();

    // Wait for the network load triggered by the scroll to complete
    await loadMorePromise;

    // 4) Re-count `meal-card` elements.
    const newCount = await mealCards.count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('filters meals based on the "search" query parameter', async ({ page }) => {
    /*
    * **Flow:**

      1. Navigate to `/meals`.
      2. Wait for the initial list to load:
          - `cards-list-skeleton` disappears.
          - `meal-card` count recorded as `initialCount`.
      3. In `TopBar`:
          - Focus `topbar-search-input`.
          - Type `"pasta"`.
          - Trigger search (click `topbar-search-submit` or press Enter, depending on your UX).
      4. Wait for navigation / reload:
          - Verify URL contains `?search=pasta`.
          - Wait until skeleton appears (optional) and then disappears.
      5. After reload:
          - Count `meal-card` again.
          - Collect titles.
    * */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals');
    await initialLoad;

    const mealCards = page.getByTestId('meal-card');
    const initialCount = await mealCards.count();
    expect(initialCount).toBeGreaterThan(0);

    //focus on top-bar-search-input

    const searchInput = page.getByTestId('search-bar-input');
    await searchInput.focus();

    //type "pasta"
    await searchInput.fill('pasta');

    //trigger search by pressing Enter
    await searchInput.press('Enter');

    // 4) Wait for navigation / reload:
    await page.waitForURL(/.*search=pasta.*/);

    // Wait for another load to complete
    const searchPromise = e2eResponsePromise(page, '/api/all-meals', 'POST');
    await searchPromise;

    // 5) After reload:
    const newCount = await mealCards.count();
    expect(newCount).toBeGreaterThan(0);
    expect(newCount).toBeLessThan(initialCount); // Expect fewer results after filtering

    // Collect titles and verify they contain "pasta"
    for (let i = 0; i < newCount; i++) {
      const title = await mealCards.nth(i).getByRole('heading').innerText();
      expect(title.toLowerCase()).toContain('pasta');
    }
  });

  test('restores default meals list when search in TopBar is cleared', async ({ page }) => {
    /*
    * **Flow:**
    * 1. Start at `/meals?search=pasta`.
      2. Wait for list to load, and record:
          - `filteredCount` = number of `meal-card` elements.
      3. In TopBar:
          - Focus `topbar-search-input`.
          - Clear its value.
          - Trigger search again.
      4. Wait for navigation / reload:
          - URL no longer has `search` param, or `search` is empty.
      5. After reload:
          - Count `meal-card` again as `restoredCount`.
     */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals?search=pasta');
    await initialLoad;

    const mealCards = page.getByTestId('meal-card');
    const filteredCount = await mealCards.count();
    expect(filteredCount).toBeGreaterThan(0);

    // 3) In TopBar:
    const searchInput = page.getByTestId('search-bar-input');
    expect(await searchInput.inputValue()).toBe('pasta');
    await searchInput.focus();
    await searchInput.fill(''); // Clear the input
    await searchInput.press('Enter'); // Trigger search

    // 4) Wait for navigation / reload:
    await page.waitForURL((url) => {
      return !url.searchParams.has('search') || url.searchParams.get('search') === '';
    });

    // Wait for another load to complete
    const restorePromise = e2eResponsePromise(page, '/api/all-meals', 'POST');
    await restorePromise;

    // 5) After reload:
    const restoredCount = await mealCards.count();
    // Expect more results after clearing filter
    expect(restoredCount).toBeGreaterThan(filteredCount);
  });

  test('shows empty state for non-matching search query', async ({ page }) => {
    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals?search=no_such_match');
    await initialLoad;

    const mealCards = page.getByTestId('meal-card');
    const mealCardsCount = await mealCards.count();
    expect(mealCardsCount).toBe(0);

    const emptyList = page.getByTestId('meals-empty-list');
    await expect(emptyList).toBeVisible();

    // --- Test "Review all meals" CTA (handle popup or same-tab)
    {
      const allMealsCta = page.getByTestId('emptyList-reviewAllMeals-cta');
      await expect(allMealsCta).toBeVisible();
      await allMealsCta.scrollIntoViewIfNeeded();
      await expect(allMealsCta).toBeEnabled();

      const allMealsPopupPromise = page
        .context()
        .waitForEvent('page', { timeout: 3000 })
        .catch(() => null);

      try {
        await allMealsCta.click({ timeout: 5000 });
      } catch {
        // fallback to DOM click when Playwright actionability blocks the click
        await allMealsCta.evaluate((el: HTMLElement) => el.click());
      }

      const allMealsPage = await allMealsPopupPromise;
      if (allMealsPage) {
        await allMealsPage.waitForLoadState('domcontentloaded');
        await expect(allMealsPage).toHaveURL(/\/meals$/);
      } else {
        await page.waitForURL(/\/meals$/);
      }
    }

    // Reload empty-state page to ensure CTAs are present and not detached
    {
      const reloadLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');
      await page.goto('/meals?search=no_such_match');
      await reloadLoad;
      await expect(page.getByTestId('meals-empty-list')).toBeVisible();
    }

    // --- Test "Back to home" CTA (handle popup or same-tab)
    {
      const backToHomeCta = page.getByTestId('emptyList-backToHome-cta');
      await expect(backToHomeCta).toBeVisible();
      await backToHomeCta.scrollIntoViewIfNeeded();
      await expect(backToHomeCta).toBeEnabled();

      const homePopupPromise = page
        .context()
        .waitForEvent('page', { timeout: 3000 })
        .catch(() => null);

      try {
        await backToHomeCta.click({ timeout: 5000 });
      } catch {
        await backToHomeCta.evaluate((el: HTMLElement) => el.click());
      }

      const homePage = await homePopupPromise;
      if (homePage) {
        await homePage.waitForLoadState('domcontentloaded');
        await expect(homePage).toHaveURL(/\/$/);
      } else {
        await page.waitForURL(/\/$/);
      }
    }
  });
});
