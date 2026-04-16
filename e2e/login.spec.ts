import { test, expect } from '@playwright/test';

test('user can log in and see the breeds page', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[placeholder="Username"]', 'emilys');
  await page.fill('input[placeholder="Password"]', 'emilyspass');
  await page.click('button[type="submit"]');

  await expect(page.locator('h1')).toHaveText('Dog Breeds');
});
