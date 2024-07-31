import type { PackageJson } from "@koine/utils";
import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  const data: PackageJson = {
    private: true,
    sideEffects: false,
    exports: {
      "./test-client": {
        "react-server": "./test-server.js",
        default: "./test-client.js",
      },
    },
  };

  return {
    package: {
      name: "package",
      ext: "json",
      content: () => JSON.stringify(data, null, 2),
    },
    test: {
      dir: "test",
      index: true,
      name: "test-client",
      ext: "ts",
      content: () => `
export const test = () => console.log("test-client!!!!!!!!!!");

export default test;`,
    },
    "test-server": {
      dir: "test",
      index: true,
      name: "test-server",
      ext: "ts",
      content: () => `
export const test = () => console.log("test-server!!!!!!!!!!");

export default test;`,
    },
  };
});
