const nrwlConfig = require("@nrwl/react/plugins/bundle-rollup");

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);

  // nxConfig.output.chunkFileNames = "[name].js";
  nxConfig.output.inlineDynamicImports = false;

  if (nxConfig.output.format === "cjs") {
    nxConfig.output.entryFileNames = (chunkInfo) => {
      return chunkInfo.name === "index" ? "[name].cjs.js" : "[name].js";
    };
  }

  if (nxConfig.output.format === "esm") {
    nxConfig.output.entryFileNames = (chunkInfo) => {
      return chunkInfo.name === "index" ? "[name].esm.js" : "[name].js";
    };
  }

  if (nxConfig.output.format === "umd") {
    nxConfig.output.entryFileNames = (chunkInfo) => {
      return chunkInfo.name === "index" ? "[name].umd.js" : "[name].js";
    };
  }

  return nxConfig;
};
