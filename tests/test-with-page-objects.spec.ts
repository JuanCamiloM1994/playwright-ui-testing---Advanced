import { test } from '@playwright/test';
import { PageManager } from '../page-objets/page-manager';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('Navigate to form layouts page', async ({ page }) => {
    const pom = new PageManager(page);
    await pom.navigationPage.formLayoutsPage();
    await pom.navigationPage.datePickerPage();
    await pom.navigationPage.toasterPage();
    await pom.navigationPage.tooltipPage();
    await pom.navigationPage.smartTablePage();
});

test('Parametrized page Object methods', async ({ page }) => {

    const pom = new PageManager(page);

    const randomFirstName = faker.person.fullName();
    const randomEmail = faker.internet.email({provider: 'example.com'});

    await pom.navigationPage.formLayoutsPage();
    await pom.formLayoutsPage.submitUsingTheGridForm(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!, 'Option 1');
    await page.screenshot({ path: 'screenshots/fomlayoutsPage.png' });
    const formLayoutPageBuffer = await page.screenshot();
    console.log(formLayoutPageBuffer.toString('base64'));
    await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: 'screenshots/inlineForm.png' });
    await pom.formLayoutsPage.submitInlineForm(randomFirstName, randomEmail, true);
    await pom.navigationPage.datePickerPage();
    await pom.datepickerPage.selectCommonDatePickerDateFromToday(5);
    await pom.datepickerPage.selectDatePickerWithDangeFromToday(3, 7);
});

