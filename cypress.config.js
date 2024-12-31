const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "85b2f2",
  e2e: {
    experimentalStudio: true,

    specPattern: 'cypress/e2e/**/*.spec.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200'
  },
});
