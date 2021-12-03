import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
};
export default config;