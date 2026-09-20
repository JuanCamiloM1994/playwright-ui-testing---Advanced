import { Page } from '@playwright/test';

export class HelperBase {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async getToastMessage() {
        //this method validates toasts and gets it is message
        return "I'm cool toaster!";
    }
}