import js from "../../adapter-js/code";
import nextTranslate from "../../adapter-next-translate/code";
import next from "../../adapter-next/code";
import type { I18nCompiler } from "../types";

const adaptersMap: Record<I18nCompiler.AdapterBuiltin, I18nCompiler.Adpater> = {
  js: js,
  next: next,
  "next-translate": nextTranslate,
};

const getIndexFile = (generatedFiles: I18nCompiler.AdpaterGeneratedFile[]) => {
  let output = "";

  generatedFiles
    .filter((generatedFile) => generatedFile.index)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((generatedFile) => {
      output += `export * from "./${generatedFile.name}";\n`;
    });
  return output;
};

const getAdapterFiles = async (
  adapterArg: I18nCompiler.AdapterArg,
  adapterName: I18nCompiler.AdapterBuiltin,
  allFiles: I18nCompiler.AdpaterFile[] = [],
) => {
  const adapterCreator = adaptersMap[adapterName];

  const { dependsOn, files } = adapterCreator(adapterArg);

  allFiles = allFiles.concat(files);

  if (dependsOn) {
    await Promise.all(
      dependsOn.map(async (adapaterName) => {
        allFiles = allFiles.concat(
          await getAdapterFiles(adapterArg, adapaterName),
        );
      }),
    );
  }

  return allFiles;
};

export type GenerateCodeOptions = {
  adapter: I18nCompiler.AdapterBuiltin;
  outputFiles?: Partial<{
    // TODO: mkae this works with generics based on chosen adapter
    // defaultLocale: string;
    // index: string;
    // isLocale: string;
    // locales: string;
    // routes: string;
    // routesSlim: string;
    // to: string;
    // toFns: string;
    // toFormat: string;
    // types: string;
  }>;
};

export async function generateCode(
  adapterArg: I18nCompiler.AdapterArg,
  options: GenerateCodeOptions,
) {
  const { adapter, outputFiles } = options;
  const files = await getAdapterFiles(adapterArg, adapter);

  // TODO: prettier
  // // prettier breaks jest, @see https://jestjs.io/docs/ecmascript-modules
  // // https://github.com/jestjs/jest/issues/14305
  // if (!process.env["JEST_WORKER_ID"]) {
  //   const { format } = await import("prettier");
  //   out = await format(out, {
  //     parser: "typescript",
  //   });
  // }

  const generatedFiles: I18nCompiler.AdpaterGeneratedFile[] = files.map(
    (file) => {
      const { fn, ...rest } = file;
      const name =
        outputFiles?.[rest.name as keyof typeof outputFiles] || rest.name;

      return { ...rest, name, content: fn(adapterArg) };
    },
  );

  generatedFiles.push({
    name: "index",
    ext: "ts",
    content: getIndexFile(generatedFiles),
  });

  return generatedFiles;
}
