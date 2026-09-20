import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});


test('Locators Syntax Rules', async ({ page }) => {
    //Find by Tag
    page.locator('input');

    // Find by ID
    page.locator('#inputEmail1');

    // Find by Class
    page.locator('.input-full-width size-medium status-basic shape-rectangle nb-transition');

    //Find by any attribute
    page.locator('[placeholder="Email"]');

    //Find by full class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    //Find by several selectos
    page.locator('input[placeholder="Email"][nbinput]');

    //Find by Xpath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]');

    //Find by partial text match
    page.locator(':text("Using")');

    //Find by exact text match
    page.locator(':text-is("Using the Grid")');

});

test('User-visible locators', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).first().click();
    await page.getByRole('textbox', { name: 'Email' }).first().fill('test@example.com');

    await page.getByLabel('Email').first().fill('test@example.com');

    await page.getByPlaceholder('Jane Doe').fill('Juan Martinez');

    await page.getByText('Submit').first().click();

    await page.getByTestId('inputEmail1').fill('test@test.com');

    await page.getByTitle('IoT Dashboard').click();
});



test('Locate child elements', async ({ page }) => {
    await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 1")').click();

    await page.locator('nb-card nb-radio-group :text-is("Option 2")').click();

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

    await page.locator('nb-card').nth(3).getByRole('button').click();
});


test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('button').click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('button').click();

    await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).getByRole('button').click();

    await page.locator('nb-card')
        .filter({ has: page.locator('nb-checkbox') })
        .filter({ hasText: 'Sign in' })
        .getByLabel('Email')
        .fill('test@example.com');

    await page.getByText('Using the Grid').locator('..').getByRole('button').click();
});

test('Reusing locators', async ({ page }) => {

    const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' });
    const emailInputField = basicFormSection.getByLabel('Email');

    await emailInputField.fill('test@example.com');
    await basicFormSection.getByLabel('Password').fill('Password');
    await basicFormSection.locator('nb-checkbox').click();
    await basicFormSection.getByRole('button').click();

    await expect(emailInputField).toHaveValue('test@example.com');
});

test('Extracting values', async ({ page }) => {
    //Extracting text
    const basicFormSection = page.locator('nb-card', { hasText: 'Basic form' });
    const submitButtonText = await basicFormSection.getByRole('button').textContent();

    console.log(submitButtonText);

    expect(submitButtonText).toEqual('Submit');

    //Extract multiples text values 
    const allRadioButtonValues = await page.locator('nb-radio').allTextContents();
    console.log(allRadioButtonValues);
    expect(allRadioButtonValues).toContain('Option 1');

    //Extract input field values
    const emailField = basicFormSection.getByRole('textbox', { name: 'Email' });
    await emailField.fill('test@example.com');
    const emailFieldValue = await emailField.inputValue();
    console.log(emailFieldValue);

    //Extract Attribute value
    const emailPlaceholder = await emailField.getAttribute('placeholder');
    console.log(emailPlaceholder);
});

test('Assertions', async ({ page }) => {
    const basicFormSectionButton = page.locator('nb-card', { hasText: 'Basic form' }).getByRole('button');
    //Generic assertions
    const value = 5;
    expect(value).toEqual(5);


    const submitButtonText = await basicFormSectionButton.textContent();
    expect(submitButtonText).toEqual('Submit');

    //Locator assertion

    await expect(basicFormSectionButton).toHaveText('Submit');

    //soft assertion
    await expect.soft(basicFormSectionButton).toHaveText('Submit');
    await basicFormSectionButton.click();

});

test('Generated test', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@example.com');
    await page.locator('#exampleInputPassword1').click();
    await page.locator('#exampleInputPassword1').fill('password');
    await page.locator('.form-group > .status-basic > .label > .custom-checkbox').click();
    await page.getByRole('checkbox', { name: 'Check me out' }).check();
}); 

/* test.describe('test suite 2', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Tables & Data').click();
    });

    test('This is a first test', async ({ page }) => {

        await page.getByText('Smart Table').click();
    });

    test('This is a first test to tree grid', async ({ page }) => {

        await page.getByText('Tree Grid').click();
    });
}); */
