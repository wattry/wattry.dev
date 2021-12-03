import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {

  await page.goto('https://dev.portal.cloud.nis.vt.edu/#/dns/records');

  await expect(page).toHaveURL('https://dev.portal.cloud.nis.vt.edu/#/dns/records');

  // Click [aria-label="Add DNS Record"]
  await page.click('[aria-label="Add DNS Record"]');
  await expect(page).toHaveURL('https://dev.portal.cloud.nis.vt.edu/#/dns/records/create');

  // Click div[role="button"]:has-text("​")
  await page.click('div[role="button"]:has-text("​")');

  // Click text=IDS - Central ID Office
  await page.click('text=IDS - Central ID Office');

  // Fill input[name="name"]
  await page.fill('input[name="name"]', 'dev.vt.edu');

  // Fill input[name="comment"]
  await page.fill('input[name="comment"]', 'Testing');

  // Click button:has-text("+ Add")
  await page.click('button:has-text("+ Add")');

  // Fill input[name="ipv4List[0].address"]
  await page.fill('input[name="ipv4List[0].address"]', '1.1.1.1');

  // Check input[name="ipv4List[0].suppressReversePointer"]
  await page.check('input[name="ipv4List[0].suppressReversePointer"]');

  // Click [aria-label="Save"]
  await page.click('[aria-label="Save"]');

  // Click text=Successfully created DNS record
  await expect(page.locator('text=host already exists (dev.vt.edu)')).not.toBeNull();
});