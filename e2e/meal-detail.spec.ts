import { expect, test } from '@playwright/test';
import { e2eResponsePromise } from '@/utils/test/e2e-test/helpers';

test.describe('Meal detail page', () => {
  test('renders the meal detail page with content after navigating from the meals list', async ({
    page,
  }) => {
    /*
     * Flow:
     * 1. Navigate to /meals and wait for meal cards to load.
     * 2. Capture the href of the first meal card link.
     * 3. Navigate directly to that meal detail URL.
     * 4. Assert the detail page container is visible.
     * 5. Assert a heading (h1) with the meal title is present.
     */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals');
    await initialLoad;

    const firstCard = page.getByTestId('meal-card').first();
    await expect(firstCard).toBeVisible();

    // Follow the card's link to the detail page
    await firstCard.click();

    // Detail page is server-rendered so wait for domcontentloaded
    await page.waitForLoadState('domcontentloaded');

    // 4) The root grid has data-testid="meal-details-page"
    await expect(page.getByTestId('meal-details-page')).toBeVisible();

    // 5) A visible h1 heading with the meal title must be present
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const titleText = await heading.innerText();
    expect(titleText.trim().length).toBeGreaterThan(0);
  });

  test('shows the Cook Mode modal when "Start Cooking" is clicked', async ({ page }) => {
    /*
     * Flow:
     * 1. Navigate to /meals and load the first meal card.
     * 2. Navigate to the first meal's detail page.
     * 3. Click "Start Cooking".
     * 4. Assert the "Cooking Mode" modal dialog is open.
     * 5. Close the modal via the "Close" button.
     * 6. Assert the dialog is no longer visible.
     */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals');
    await initialLoad;

    await page.getByTestId('meal-card').first().click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByTestId('meal-details-page')).toBeVisible();

    // 3) Click "Start Cooking" to open the Cook Mode modal
    const startCookingButton = page.getByRole('button', { name: /start cooking/i });
    await expect(startCookingButton).toBeVisible();
    await startCookingButton.click();

    // 4) The modal dialog should be open with the "Cooking Mode" heading
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const modalHeading = dialog.getByRole('heading', { name: /cooking mode/i });
    await expect(modalHeading).toBeVisible();

    // 5) Close the modal via the "Close" button inside the dialog
    const closeButton = dialog.getByRole('button', { name: /^close$/i });
    await closeButton.click();

    // 6) The dialog should no longer be visible
    await expect(dialog).not.toBeVisible();
  });

  test('displays ingredient list on the meal detail page', async ({ page }) => {
    /*
     * Flow:
     * 1. Navigate to /meals and open the first meal detail page.
     * 2. Assert at least one ingredient item is present.
     */

    const initialLoad = e2eResponsePromise(page, '/api/all-meals', 'POST');

    await page.goto('/meals');
    await initialLoad;

    await page.getByTestId('meal-card').first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByTestId('meal-details-page')).toBeVisible();

    // Ingredients are listed under a heading that contains "Ingredient"
    const ingredientsSection = page.getByRole('heading', { name: /ingredient/i });
    await expect(ingredientsSection).toBeVisible();
  });
});
