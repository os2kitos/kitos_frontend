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
      // Only enable code coverage when running headless on ci
      if (!config.watchForFileChanges) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('@cypress/code-coverage/task')(on, config);
      }

      return config;
    },
  },
});
