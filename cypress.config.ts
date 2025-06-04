import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    projectId: 'gxw2cv',
    baseUrl: 'http://localhost:4200',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1000,
    experimentalRunAllSpecs: true,
    retries: {
      runMode: 2,
      openMode: 1,
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
