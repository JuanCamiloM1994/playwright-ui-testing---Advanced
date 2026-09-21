import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('/');
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();
    testInfo.setTimeout(testInfo.timeout + 3000);
});

test('Auto waiting', async ({ page }) => {
    const dialogWithDelayForm = page.locator('nb-card', { hasText: 'Open Dialog With Delay' });
    await dialogWithDelayForm.getByRole('button', { name: '3 seconds' }).click();

    const dialogContainer = page.locator('nb-dialog-container');
    //await dialogContainer.getByRole('button', { name: 'OK' }).click();

    const dialogHeader = await dialogContainer.locator('nb-card-header').textContent();
    expect(dialogHeader).toEqual('Friendly reminder');
});

test('Alternative waits', async ({ page }) => {
    const dialogWithDelayForm = page.locator('nb-card', { hasText: 'Open Dialog With Delay' });
    await dialogWithDelayForm.getByRole('button', { name: '3 seconds' }).click();
    const dialogContainer = page.locator('nb-dialog-container');

    //wait for the element 
    //await dialogContainer.waitFor();
    //await page.waitForSelector('nb-dialog-container');

    //wait for API response 
    //await page.waitForResponse('**/delay/*');

    //wait for load state (NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle');

    //Hardcoded wait (NEVER EVER USE IT JUST NEVER)
    await page.waitForTimeout(3500);

    /* const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents();
    expect(dialogHeaderText).toContain('Friendly reminder');
 */
    await expect(dialogContainer.locator('nb-card-header')).toHaveText('Friendly reminder');
});

test('Timeouts', async ({ page }) => {
    //test.setTimeout(120000);
    test.slow();
    const dialogWithDelayForm = page.locator('nb-card', { hasText: 'Open Dialog With Delay' });
    await dialogWithDelayForm.getByRole('button', { name: '3 seconds' }).click();
    const dialogContainer = page.locator('nb-dialog-container');

    await dialogContainer.getByRole('button', { name: 'OK' }).click({ timeout: 4000 });
});
