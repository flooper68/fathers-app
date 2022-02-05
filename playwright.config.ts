import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: 'tests-out/**/*.spec.js',

};
export default config;
