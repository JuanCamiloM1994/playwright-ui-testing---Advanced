import { Page } from '@playwright/test';
import { NavigationPage } from '../page-objets/navigation-page';
import { FormLayoutsPage } from '../page-objets/form-layouts-page';
import { DatepickerPage } from '../page-objets/datepicker-page';

export class PageManager {
    readonly navigationPage: NavigationPage;
    readonly formLayoutsPage: FormLayoutsPage;
    readonly datepickerPage: DatepickerPage;

    constructor(page: Page) {
        this.navigationPage = new NavigationPage(page);
        this.formLayoutsPage = new FormLayoutsPage(page);
        this.datepickerPage = new DatepickerPage(page);
    }
}