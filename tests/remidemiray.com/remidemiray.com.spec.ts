import { expect, test } from '@playwright/test';

const blogUrl = 'https://remidemiray.com/';

test.describe('remidemiray.com homepage UI', () => {
  test('keeps the site header, navigation, and content in separate layout regions', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(blogUrl);

    const header = page.getByRole('banner');
    const navigation = header.getByRole('navigation');
    const main = page.getByRole('main');

    await expect(header).toBeVisible();
    await expect(header.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(navigation).toBeVisible();
    await expect(main).toBeVisible();

    const links = navigation.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    for (let index = 0; index < linkCount; index += 1) {
      await expect(links.nth(index)).toBeVisible();
      await expect(links.nth(index)).toHaveAttribute('href', /\S/);
    }

    const headerBox = await header.boundingBox();
    const mainBox = await main.boundingBox();
    if (headerBox === null || mainBox === null) {
      throw new Error('Expected the header and main content to have layout boxes.');
    }
    expect(headerBox.y + headerBox.height).toBeLessThan(mainBox.y);
  });

  test('opens and closes the mobile navigation menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(blogUrl);

    const navigation = page.getByRole('banner').getByRole('navigation');
    const openMenuButton = navigation.getByRole('button', { name: /open menu/i });
    await expect(openMenuButton).toBeVisible();
    await openMenuButton.click();

    const menu = page.getByRole('dialog', { name: /menu/i });
    await expect(menu).toBeVisible();

    const links = menu.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let index = 0; index < linkCount; index += 1) {
      await expect(links.nth(index)).toBeVisible();
      await expect(links.nth(index)).toHaveAttribute('href', /\S/);
    }

    await menu.getByRole('button', { name: /close menu/i }).click();
    await expect(menu).toBeHidden();
  });
});
