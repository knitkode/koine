import { join } from "path";
import { existsSync, renameSync } from "fs";
// import { rename } from "fs/promises";
import { ExecutorContext, readJsonFile, writeJsonFile } from "@nrwl/devkit";

export interface MultipleExecutorOptions {}

export default async function multipleExecutor(
  options: MultipleExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  // const { projectName } = context;
  // const packageIndex = join("./dist/packages", projectName, "index.js");
  // // const packageSrc = join("./packages", projectName, 'package.json');
  // const packageDist = join("./dist/packages", projectName, "package.json");
  // // const packageJson = readJsonFile(join(options.projectRoot, 'package.json'));
  // const packageJson = readJsonFile(packageDist);

  // if (existsSync(packageIndex)) {
  //   renameSync(packageIndex, packageIndex.replace(/\.js/, ".esm.js"));
  //   packageJson.module = "./index.esm.js";
  // }

  // packageJson.main = "./index.umd.js";

  // // writeJsonFile(`${options.outputPath}/package.json`, packageJson);
  // writeJsonFile(packageDist, packageJson);

  return { success: true };
}
