import { forin } from "@koine/utils";
import type { I18nCompiler } from "../types";
import {
  getAdapter,
  getAdapterFileContent,
  getAdapterFileMeta,
  getAdapterSync,
} from "./adapters";

const getBarrelFileContent = (
  generatedFiles: I18nCompiler.AdapterFileGenerated[],
) => {
  let content = "";

  generatedFiles
    .filter((generatedFile) => generatedFile.index)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((generatedFile) => {
      content += `export * from "./${generatedFile.name}";\n`;
    });
  return content;
};

const getBarrelFiles = (
  generatedFiles: I18nCompiler.AdapterFileGenerated[],
) => {
  const filesGroupedByDir = generatedFiles.reduce(
    (map, generatedFile) => {
      const dir = generatedFile.dir || ".";
      map[dir] = map[dir] || [];
      map[dir].push(generatedFile);
      return map;
    },
    {} as Record<string, I18nCompiler.AdapterFileGenerated[]>,
  );

  const indexFiles: I18nCompiler.AdapterFileGenerated[] = [];

  forin(filesGroupedByDir, (dir, filesInDir) => {
    const content = getBarrelFileContent(filesInDir);
    if (content) {
      const file = {
        content,
        ext: "ts",
        name: "index",
        dir,
        index: false,
      } as const;
      const meta = getAdapterFileMeta({}, file);
      indexFiles.push({ ...file, ...meta });
    }
  });

  return indexFiles;
};

const generateCodeFromAdapter = <T extends I18nCompiler.AdapterName>(
  data: I18nCompiler.DataCode<T>,
  adapter: I18nCompiler.AdapterResolved<T>,
) => {
  const { outputFiles } = data.options;
  // NOTE: we allow adapters to produce the same files as their dependent's
  // parent adapters, here we ensure the parent adapters files do not override
  // their children same-named ones which should get the priority
  const previousAdaptersGeneratedFilesPaths: Record<string, 1> = {};

  const { generators, transformers } = adapter;

  const generatedFiles = generators.reduce((all, generator) => {
    const files = generator(data);

    Object.keys(files).forEach((fileId) => {
      const _file = files[fileId];
      const transformerId = fileId as keyof typeof transformers;
      const file = transformers?.[transformerId]?.(_file as never) ?? _file;
      const { content } = file;
      const { dir, name, path } = getAdapterFileMeta(outputFiles, file);

      // check that we haven't already generated this file
      if (!previousAdaptersGeneratedFilesPaths[path]) {
        previousAdaptersGeneratedFilesPaths[path] = 1;

        all.push({
          ...file,
          dir,
          name,
          path,
          content: getAdapterFileContent(file, content()),
        });
      }
    });

    return all;
  }, [] as I18nCompiler.AdapterFileGenerated[]);

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

  return {
    // automatically create indexs file if the adapters want them
    files: [...generatedFiles, ...(getBarrelFiles(generatedFiles) || [])],
  };
};

export type CodeGenerateReturn =
  | Awaited<ReturnType<typeof generateCode>>
  | ReturnType<typeof generateCodeSync>;

export let generateCode = async <T extends I18nCompiler.AdapterName>(
  data: I18nCompiler.DataCode<T>,
) => generateCodeFromAdapter(data, await getAdapter(data));

export let generateCodeSync = <T extends I18nCompiler.AdapterName>(
  data: I18nCompiler.DataCode<T>,
) => generateCodeFromAdapter(data, getAdapterSync(data));
