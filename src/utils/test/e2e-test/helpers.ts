import { Page } from '@playwright/test';

export const e2eResponsePromise = (page: Page, apiUrl: string, method: 'POST' | 'GET') =>
  page.waitForResponse((res) => res.url().includes(apiUrl) && res.request().method() === method);
