const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  {
    ignores: [
      "__mocks__/",
      "packages/i18n/__mocks__/",
    ],
    // files: ["packages/i18n/**/*.ts", "packages/i18n/**/*.tsx"],
    // rules: {},
  },
  // {
  //   ignores: ["packages/i18n/__mocks__"]
  // }
  // {
  //   "files": ["actions/**/*.ts", "__mocks__/**/*.ts", "__mocks__/**/*.tsx"],
  //   "rules": {
  //     "@nx/enforce-module-boundaries": "off"
  //   }
  // }
];
