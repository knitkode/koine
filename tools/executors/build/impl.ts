import { join } from "path";
import { ExecutorContext, readJsonFile, writeJsonFile } from "@nrwl/devkit";

export interface MultipleExecutorOptions {}

export default async function multipleExecutor(
  options: MultipleExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { projectName } = context;
  // const packageSrc = join("./packages", projectName, 'package.json');
  const packageDist = join("./dist/packages", projectName, "package.json");
  // const packageJson = readJsonFile(join(options.projectRoot, 'package.json'));
  const packageJson = readJsonFile(packageDist);

  packageJson.main = "./index.umd.js";
  packageJson.module = "./index.js";

  // writeJsonFile(`${options.outputPath}/package.json`, packageJson);
  writeJsonFile(packageDist, packageJson);

  return { success: true };
}
