import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    projectId: "gxw2cv",
    baseUrl: 'http://localhost:4200',
    video: false,
    viewportWidth: 1440,
    viewportHeight: 1000,
    experimentalRunAllSpecs: true
  },
});
