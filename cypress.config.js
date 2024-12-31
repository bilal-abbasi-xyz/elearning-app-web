const { defineConfig } = require("cypress");
const { addImageDiffPlugin } = require('cypress-image-diff-js');

module.exports = (on, config) => {
  addImageDiffPlugin(on, config);
};
module.exports = defineConfig({
  projectId: 'a5jq5w',
  e2e: {
    experimentalStudio: true,
    specPattern: 'cypress/e2e/**/*.spec.js',
    setupNodeEvents(on, config) {

    },
    baseUrl: 'http://localhost:4200'
  },
});
