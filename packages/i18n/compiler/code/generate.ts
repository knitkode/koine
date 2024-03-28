import { isPromise } from "@koine/utils";
import js from "../../adapter-js/code";
import nextTranslate from "../../adapter-next-translate/code";
import next from "../../adapter-next/code";
import react from "../../adapter-react/code";
import type { I18nCompiler } from "../types";

const getIndexFile = (generatedFiles: I18nCompiler.AdapterGeneratedFile[]) => {
  let output = "";

  generatedFiles
    .filter((generatedFile) => generatedFile.index)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((generatedFile) => {
      output += `export * from "./${generatedFile.name}";\n`;
    });
  return output;
};

const getAdapterCreator = <T extends I18nCompiler.AnyAdapter["name"]>(
  adapterName: T,
) => {
  switch (adapterName) {
    case "js":
      return js;
    case "next":
      return next;
    case "next-translate":
      return nextTranslate;
    case "react":
      return react;
  }
  return js;
};

/**
 * Recursively builds a list of adapters to use based on the `dependsOn` array
 * of the choosen adapter
 */
const getAdapters = async <T extends I18nCompiler.AnyAdapter>(
  adapterArgData: I18nCompiler.AdapterArgData,
  { name, options = {} }: T,
  adapters: I18nCompiler.Adapter[] = [],
) => {
  const adapterCreator = getAdapterCreator(name);
  const adapterToResolve = adapterCreator(adapterArgData, options || {});
  const adapter = isPromise(adapterToResolve)
    ? await adapterToResolve
    : adapterToResolve;
  adapters = adapters.concat([adapter]);

  if (adapter.dependsOn) {
    await Promise.all(
      adapter.dependsOn.map(async (adapaterName) => {
        adapters = adapters.concat(
          await getAdapters(adapterArgData, { name: adapaterName }),
        );
      }),
    );
  }

  return adapters;
};

/**
 * Recursively builds a list of adapters to use based on the `dependsOn` array
 * of the choosen adapter, it filters out and warn if async adapters are defined
 */
const getAdaptersSync = <T extends I18nCompiler.AnyAdapter>(
  adapterArgData: I18nCompiler.AdapterArgData,
  { name, options = {} }: T,
  adapters: I18nCompiler.Adapter[] = [],
) => {
  const adapterCreator = getAdapterCreator(name);
  const adapterToResolve = adapterCreator(adapterArgData, options || {});

  if (isPromise(adapterToResolve)) {
    console.warn(
      `i18nCompiler: unsupported use of async adapter '${name}'`,
      "Please use the sync api",
    );
  } else {
    const adapter = adapterToResolve;
    adapters = adapters.concat([adapter]);

    if (adapter.dependsOn) {
      adapter.dependsOn.forEach((adapaterName) => {
        adapters = adapters.concat(
          getAdaptersSync(adapterArgData, { name: adapaterName }),
        );
      });
    }
  }

  return adapters;
};

const generateCodeFromAdapters = (
  data: I18nCompiler.DataCode,
  adapters: I18nCompiler.Adapter[],
) => {
  const { outputFiles } = data.options;
  const files = adapters.reduce((allFiles, adapter) => {
    // NOTE: we allow adapters to produce the same files as their dependent's
    // parent adapters (defined with `dependsOn`), here we ensure the parent
    // adapters files do not override their children same-named ones which
    // should get the priority
    const previousAdaptersFilesNames = allFiles.map(
      (file) => file.name + file.ext,
    );
    return [
      ...allFiles,
      ...adapter.files.filter(
        (file) => !previousAdaptersFilesNames.includes(file.name + file.ext),
      ),
    ];
  }, [] as I18nCompiler.AdapterFile[]);

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

  const generatedFiles: I18nCompiler.AdapterGeneratedFile[] = files.map(
    (file) => {
      const { fn, ...rest } = file;
      const name =
        outputFiles?.[rest.name as keyof typeof outputFiles] || rest.name;

      return {
        ...rest,
        name,
        content: fn({
          ...data,
          adapterOptions: data.options.adapter.options || {},
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

export type CodeGenerateReturn =
  | Awaited<ReturnType<typeof generateCode>>
  | ReturnType<typeof generateCodeSync>;

export let generateCode = async (data: I18nCompiler.DataCode) =>
  generateCodeFromAdapters(data, await getAdapters(data, data.options.adapter));

export let generateCodeSync = (data: I18nCompiler.DataCode) =>
  generateCodeFromAdapters(data, getAdaptersSync(data, data.options.adapter));
