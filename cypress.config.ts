import { defineConfig } from "cypress";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { beforeRunHook, afterRunHook } = require("cypress-mochawesome-reporter/lib") as {
  beforeRunHook: (details: unknown) => Promise<void>;
  afterRunHook: () => Promise<void>;
};

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    reportPageTitle: "OrangeHRM Test Report",
    overwrite: false,
    timestamp: "mmddyyyy_HHMMss",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    defaultCommandTimeout: 10000,
    retries: { runMode: 1, openMode: 0 },
    viewportWidth: 1280,
    viewportHeight: 720,
    screenshotsFolder: "cypress/reports/screenshots",
    videosFolder: "cypress/reports/videos",
    setupNodeEvents(on) {
      on("before:run", async (details) => {
        await beforeRunHook(details);
      });
      on("after:run", async () => {
        await afterRunHook();
      });
    },
  },
});
