import { defineConfig, devices } from '@playwright/test';


import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 10000, 
  globalTimeout: 60000,
  expect: {
    timeout: 6000,
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    //actionTimeout: 4000,
    baseURL: process.env.URL,
    trace: 'on-first-retry',
    video: 'on',
  },
  projects: [
    {
      name: 'page-object-tests',
      testMatch: '*page-objects.spec.ts',
    },
    {
      name: 'chromium',
      timeout: 20000, 
      retries: 3,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
