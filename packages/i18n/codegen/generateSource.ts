import type { I18nCodegen } from "./types";

const getIndexFile = (sources: I18nCodegen.AdpaterFileWithContent[]) => {
  let output = "";

  sources
    .filter((source) => source.index)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((source) => {
      output += `export * from "./${source.name}";\n`;
    });
  return output;
};

const getAdapterFiles = async (
  adapterArg: I18nCodegen.AdapterArg,
  adapterName: I18nCodegen.AdapterBuiltin,
  allFiles: I18nCodegen.AdpaterFile[] = [],
) => {
  const adapterCreator = (await import(
    `../adapter-${adapterName}/codegen`
  ).then((m) => m.default)) as I18nCodegen.Adpater;

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

export type I18nCodegenSourceOptions = {
  adapter: I18nCodegen.AdapterBuiltin;
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

export async function generateSource(
  adapterArg: I18nCodegen.AdapterArg,
  options: Partial<I18nCodegenSourceOptions> = {},
) {
  const { adapter = "js", outputFiles } = options;
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

  const sources: I18nCodegen.AdpaterFileWithContent[] = files.map((file) => {
    const { fn, ...rest } = file;
    const name =
      outputFiles?.[rest.name as keyof typeof outputFiles] || rest.name;

    return { ...rest, name, content: fn(adapterArg) };
  });

  sources.push({
    name: "index",
    ext: "ts",
    content: getIndexFile(sources),
  });

  return sources;
}
