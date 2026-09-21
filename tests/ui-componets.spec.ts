import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Form Layouts page', () => {
    test.describe.configure({ retries: 2 });

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();

    });


    test('input fields', async ({ page }, testInfo) => {

        if (testInfo.retry) {
            //Clean test data
            console.log(`Retrying test: ${testInfo.title}`);
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' })
            .getByRole('textbox', { name: 'Email' });

        await usingTheGridEmailInput.fill('test@example.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test@example.com', { delay: 500 });

        //Extract the value 
        const inputValue = await usingTheGridEmailInput.inputValue();

        //assertion
        await expect(usingTheGridEmailInput).toHaveValue('test@example.com');
        await expect(usingTheGridEmailInput).toHaveValue(/example.com/);

    });

    test('Radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        await usingTheGridForm.getByLabel('Option 1').check({ force: true });
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });

        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked();
        expect(radioStatus).toBeTruthy();

        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked();
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();

    });
});

test('Checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    //await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true });
    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
    //await page.getByRole('checkbox', { name: 'Hide on click' }).click({ force: true });

    const allBoxes = await page.getByRole('checkbox');
    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true });
        await expect(box).not.toBeChecked();
    }


    for (const box of await allBoxes.all()) {
        await box.check({ force: true });
        await expect(box).toBeChecked();
    }
});

test('List and dropsowns', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    //standar dropdown
    await page.locator('.form-group', { hasText: 'Toast type:' }).getByRole('combobox').selectOption('info');
    await expect(page.getByRole('combobox')).toHaveValue('info');

    //custom dropdown
    await page.locator('.form-group', { hasText: 'Position' }).locator('nb-select').click();

    //option 1
    //await page.getByRole('list').getByText('bottom-end').click();

    //option 2
    await page.locator('nb-option', { hasText: 'bottom-end' }).click();
    await expect(page.locator('.form-group', { hasText: 'Position' }).locator('nb-select')).toHaveText('bottom-end');

    //looping through the list
    const positionDropDownField = page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select');
    await positionDropDownField.click();
    const allListValues = await page.locator('nb-option').allTextContents();
    for (const listValue of allListValues) {
        await page.locator('nb-option', { hasText: listValue }).click();
        await expect(positionDropDownField).toHaveText(listValue);
        await positionDropDownField.click();
    }

});

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    await page.getByRole('button', { name: 'Top' }).hover();
    await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip');
});

test('Dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //Always before to interact with a dialog, set up the dialog event handler
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept()
    });

    //because playwright inmidiatly click on the confirmation button
    await page.locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();

    await expect(page.locator('tr', { hasText: 'mdo@gmail.com' })).not.toBeVisible();


});

test('Web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //1 how to select row by any visible text 
    const tableRowByEmail = page.getByRole('row', { name: 'twitter@outlook.com' });
    await tableRowByEmail.locator('.nb-edit').click();
    await tableRowByEmail.getByPlaceholder('Age').fill('35');
    await tableRowByEmail.locator('.nb-checkmark').click();

    await expect(tableRowByEmail.locator('td').last()).toHaveText('35');


    //2 get row by a specific value 

    const tableRowById = page.getByRole('row').filter({ has: page.getByRole('cell').nth(1).getByText('10') });
    await tableRowById.locator('.nb-edit').click();
    await page.locator('tbody').getByPlaceholder('E-mail').fill('test@example.com');
    await page.locator('tbody').locator('.nb-checkmark').click();
    await expect(tableRowById.locator('td').nth(5)).toHaveText('test@example.com');


    //3 loop through table rows 
    const ages = ["20", "35", "200"];
    for (const age of ages) {
        await page.getByPlaceholder('Age').fill(age);

        if (age == "200") {
            await expect(page.locator('tbody')).toContainText('No data found');
        } else {
            await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age);
            const allTableRows = await page.locator('tbody tr').all();
            for (const row of allTableRows) {
                await expect(row.locator('td').last()).toHaveText(age);
            }
        }
    }
});

test('Datepicker', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    const date = new Date();
    date.setDate(date.getDate() + 40);

    const expectedDay = date.getDate().toString();
    const expectedMonth = date.toLocaleString('En-US', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`;

    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('.next-month').click();
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click();
    await expect(calendarInputField).toHaveValue(expectedDate);
});

test('sliders', async ({ page }) => {

    // 1 setting the attribute values
    /*     const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
        await tempGauge.evaluate(element => {
            element.setAttribute('cx', '232.630');
            element.setAttribute('cy', '232.630');
        });
    
        await tempGauge.click(); */

    // 2 mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();
    const x = box?.x + box?.width / 2;
    const y = box?.y + box?.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y); // Move the mouse 50 pixels to the right
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();
    await expect(tempBox).toContainText('30');
});

test('iframes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Dialog').click();

    const frameLocator = page.frameLocator('[data-cy="esc-close-iframe"]');

    await frameLocator.getByRole('button', { name: 'Open Dialog with esc close' }).click();
});

test('Drag & Drop', async ({ page }) => {
    await page.getByText('Extra Components').click();
    await page.getByText('Drag & Drop').click();

    // option #1
    await page.getByText('Clean my room').dragTo(page.locator('#drop-list'));

    // Option 2
    await page.getByText('Get groceries').hover();
    await page.mouse.down();
    await page.locator('#drop-list').hover();
    await page.mouse.up();

});