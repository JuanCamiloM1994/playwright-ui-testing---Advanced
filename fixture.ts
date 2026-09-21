import { test as base } from '@playwright/test';
import { PageManager } from './page-objets/page-manager';

type FixtureType = {
    pom: PageManager;
}
export const test = base.extend<FixtureType>({
    pom: async ({ page }, use) => {
        await page.goto('/');
        const manager = new PageManager(page);
        await use(manager);
    }
});