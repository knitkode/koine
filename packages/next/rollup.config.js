const path = require("path");

module.exports = (config) => {
  // console.log("rollup!", config);
  // we cannot have an array here to manage the multi entries
  return {
    ...config,
    input: path.resolve(process.cwd(), "packages/next/src/config/index.ts"),
    output: {
      ...config.output,
      format: "cjs",
      entryFileNames: "config.js",
      chunkFileNames: "config.js",
    },
  };
};
