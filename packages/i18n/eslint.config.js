const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
 */
module.exports = [
  // ...baseConfig,
  ...baseConfig.map((config) => ({
    ...config,
    ignores: [
      // "packages/i18n/__mocks__",
      // "__mocks__/**/*.{ts,tsx}"
      "packages/i18n/__mocks__/**/*.{ts,tsx}",
    ],
  })),
  {
    files: ["packages/i18n/**/*.ts", "packages/i18n/**/*.tsx"],
    rules: {},
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
