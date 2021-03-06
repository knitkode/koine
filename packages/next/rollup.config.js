// FIXME: this is a workaround adapted from
// https://github.com/nrwl/nx/issues/2212#issuecomment-894064983
const { join } = require("path");
const nrwlConfig = require("@nrwl/react/plugins/bundle-rollup");

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);

  if (nxConfig.output.format === "cjs") {
    nxConfig.input = {
      index: nxConfig.input,
      app: join(__dirname, "./app/index.ts"),
      config: join(__dirname, "./config/index.ts"),
      document: join(__dirname, "./document/index.ts"),
    };
    nxConfig.output.entryFileNames = (chunkInfo) => {
      return chunkInfo.name === "index" ? "[name].umd.js" : "[name].js";
    };
    nxConfig.output.chunkFileNames = "[name].js";
    nxConfig.output.inlineDynamicImports = false;
  }

  return nxConfig;
};
