const { createGlobPatternsForDependencies } = require("@nrwl/next/tailwind");
const { join } = require("path");

module.exports = {
  // presets: [require("../../../tailwind-workspace-preset.js")],
  content: [
    join(__dirname, "/**/*.{ts,tsx,js,jsx}"),
    ...createGlobPatternsForDependencies(__dirname, "/**/*.{ts,tsx,js,jsx}"),
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
