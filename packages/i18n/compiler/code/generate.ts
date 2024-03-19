import { isPromise } from "@koine/utils";
import js from "../../adapter-js/code";
import nextTranslate from "../../adapter-next-translate/code";
import next from "../../adapter-next/code";
import type { I18nCompiler } from "../types";

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

const getAdapterCreator = <T extends I18nCompiler.AdaptersName>(
  adapterName: T,
) => {
  switch (adapterName) {
    case "js":
      return js;
    case "next":
      return next;
    case "next-translate":
      return nextTranslate;
  }
  return js;
};

/**
 * Recursively builds a list of adapters to use based on the `dependsOn` array
 * of the choosen adapter
 */
const getAdapters = async <T extends I18nCompiler.AdaptersName>(
  adapterArg: I18nCompiler.AdapterArg<T>,
  adapterName: T,
  adapters: I18nCompiler.Adpater[] = [],
) => {
  // const { name } = adapterArg;
  // const adapterCreator = adaptersMap[adapterName];
  const adapterCreator = getAdapterCreator(
    adapterName,
  ) as I18nCompiler.AdpaterCreator<T>;
  const adapterToResolve = adapterCreator(adapterArg);
  const adapter = isPromise(adapterToResolve)
    ? await adapterToResolve
    : adapterToResolve;
  adapters = adapters.concat([adapter as I18nCompiler.Adpater]);

  if (adapter.dependsOn) {
    await Promise.all(
      adapter.dependsOn.map(async (adapaterName) => {
        adapters = adapters.concat(await getAdapters(adapterArg, adapaterName));
      }),
    );
  }

  return adapters;
};

/**
 * Recursively builds a list of adapters to use based on the `dependsOn` array
 * of the choosen adapter, it filters out and warn if async adapters are defined
 */
const getAdaptersSync = <T extends I18nCompiler.AdaptersName>(
  adapterArg: I18nCompiler.AdapterArg<T>,
  adapterName: T,
  adapters: I18nCompiler.Adpater[] = [],
) => {
  const adapterCreator = getAdapterCreator(
    adapterName,
  ) as I18nCompiler.AdpaterCreator<T>;
  const adapterToResolve = adapterCreator(adapterArg);

  if (isPromise(adapterToResolve)) {
    console.warn(
      `i18nCompiler: unsupported use of async adapter '${adapterName}'`,
      "Please use the sync api",
    );
  } else {
    const adapter = adapterToResolve;
    adapters = adapters.concat([adapter as I18nCompiler.Adpater]);

    if (adapter.dependsOn) {
      adapter.dependsOn.forEach((adapaterName) => {
        adapters = adapters.concat(getAdaptersSync(adapterArg, adapaterName));
      });
    }
  }

  return adapters;
};

const generateCodeFromAdapters = (
  data: I18nCompiler.DataCode,
  options: CodeGenerateOptions,
  adapters: I18nCompiler.Adpater[],
) => {
  const { outputFiles } = options;
  const files = adapters.reduce(
    (allFiles, adapter) => [...allFiles, ...adapter.files],
    [] as I18nCompiler.AdpaterFile[],
  );

  // TODO: prettier does probably not make sense unless one wants to keep the
  // auto-generated files on git, maybe allow this as an option?
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

      return {
        ...rest,
        name,
        content: fn({
          ...data,
          adapterOptions: options.adapter,
        }),
      };
    },
  );

  // automatically create an index file if the adapters want it
  const indexFileContent = getIndexFile(generatedFiles);

  if (indexFileContent) {
    generatedFiles.push({
      name: "index",
      ext: "ts",
      content: getIndexFile(generatedFiles),
    });
  }

  return {
    files: generatedFiles,
    // it is enough that just one adapter requires this
    needsTranslationsFiles: adapters.some(
      (adapter) => adapter.needsTranslationsFiles,
    ),
  };
};

export type CodeGenerateOptions<
  T extends I18nCompiler.AdaptersName = I18nCompiler.AdaptersName,
> = {
  adapter: {
    name: T;
    options: I18nCompiler.AdaptersOptions<T>;
  };
  outputFiles?: Partial<{
    // TODO: make this works with generics based on chosen adapter?
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

export type CodeGenerateReturn =
  | Awaited<ReturnType<typeof generateCode>>
  | ReturnType<typeof generateCodeSync>;

export let generateCode = async <T extends I18nCompiler.AdaptersName>(
  data: I18nCompiler.DataCode,
  options: CodeGenerateOptions<T>,
) =>
  generateCodeFromAdapters(
    data,
    options,
    await getAdapters(
      { ...data, adapterOptions: options.adapter.options },
      options.adapter.name,
    ),
  );

export let generateCodeSync = <T extends I18nCompiler.AdaptersName>(
  data: I18nCompiler.DataCode,
  options: CodeGenerateOptions<T>,
) =>
  generateCodeFromAdapters(
    data,
    options,
    getAdaptersSync(
      { ...data, adapterOptions: options.adapter.options },
      options.adapter.name,
    ),
  );
