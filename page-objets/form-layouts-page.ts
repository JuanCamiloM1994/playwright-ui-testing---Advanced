import { Page } from '@playwright/test';
import { step } from '../helpers/test-step-decorator';
import { HelperBase } from './helper-base';

export class FormLayoutsPage extends HelperBase {


    constructor(page: Page) {
        super(page);
    }

    @step
    async submitUsingTheGridForm(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', { hasText: 'Using the Grid' });
        await usingTheGridForm.getByRole('textbox', { name: 'Email' }).fill(email);
        await usingTheGridForm.getByRole('textbox', { name: 'Password' }).fill(password);
        await usingTheGridForm.getByLabel(optionText).check({ force: true });
        await usingTheGridForm.getByRole('button', { name: 'Sign in' }).click();

    }

    /**
     * This method submits inline form with user full name, email and remember me checkbox can be selected
     * @param fullName - valid test user full name (First and last name)
     * @param email - valid test user email address
     * @param remeberMeCheckBox - boolean indicating whether to check the "Remember me" checkbox
     */
    @step
    async submitInlineForm(fullName: string, email: string, remeberMeCheckBox: boolean) {
        const inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' });
        await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email);
        await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(fullName);
        if (remeberMeCheckBox) {
            await inlineForm.getByRole('checkbox').check({ force: true });
        }
        await inlineForm.getByRole('button', { name: 'Submit' }).click();
    }
}