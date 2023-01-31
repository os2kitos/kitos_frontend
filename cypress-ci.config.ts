import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    reporter: 'teamcity',
    baseUrl: 'http://localhost:4200',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1000,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 1,
    },

    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});
