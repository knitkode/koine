const baseConfig = require("../../eslint.config.js");

/**
 * @type {import("@eslint/eslintrc").ConfigArray}
 */
module.exports = [
  ...baseConfig,
  // ...baseConfig.map(a => ({
  //   ...a,
  //   ignorePattern: "__mocks__/**/*.{ts,tsx}"
  // })),
  {
    files: ["packages/i18n/**/*.ts", "packages/i18n/**/*.tsx"],
    rules: {},
  },
  // "ignorePatterns": ["!**/*", "__mocks__/**/*.ts"],
  // {
  //   "files": ["actions/**/*.ts", "__mocks__/**/*.ts", "__mocks__/**/*.tsx"],
  //   "rules": {
  //     "@nx/enforce-module-boundaries": "off"
  //   }
  // }
];
