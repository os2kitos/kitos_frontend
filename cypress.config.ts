import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    projectId: 'gxw2cv',
    baseUrl: 'http://localhost:4200',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1000,
    experimentalRunAllSpecs: true,
    // Backend is fully mocked via cy.intercept fixtures, so real network latency never
    // occurs; the 30s Cypress default responseTimeout only delays failure detection when
    // something hangs (e.g. a missed/misnamed intercept alias).
    responseTimeout: 15000,
    // Root causes of flakiness (fixed waits, intercept-ordering races) have been fixed;
    // keep 1 retry as a safety net for genuine environment-level flakiness, not to mask bugs.
    retries: {
      runMode: 1,
      openMode: 0,
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    viewportWidth: 1440,
    viewportHeight: 1000,
    specPattern: '**/*.cy.ts',
  },
});
