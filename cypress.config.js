const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'a5jq5w',
  e2e: {
    experimentalStudio: true,

    specPattern: 'cypress/e2e/**/*.spec.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200'
  },
});
