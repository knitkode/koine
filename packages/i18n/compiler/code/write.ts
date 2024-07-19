import { renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import * as ts from "typescript";
import { fsWrite, fsWriteSync } from "@koine/node";
import type { I18nCompiler } from "../types";
import {
  type CodeGenerateReturn,
  generateCode,
  generateCodeSync,
} from "./generate";
import { tsCompile } from "./tsCompile";

const writeCodeFiles = async (
  cwd: string,
  output: string,
  codeGenerated: CodeGenerateReturn,
  files: Set<string>,
) =>
  Promise.all(
    codeGenerated.files.map(async ({ name, ext, content }) => {
      const relativePath = `${name}.${ext}`;
      const filepath = join(cwd, output, relativePath);

      await fsWrite(filepath, content);
      files.add(relativePath);
    }),
  );

const writeCodeFilesSync = (
  cwd: string,
  output: string,
  codeGenerated: CodeGenerateReturn,
  files: Set<string>,
) =>
  codeGenerated.files.map(({ name, ext, content }) => {
    const relativePath = `${name}.${ext}`;
    const filepath = join(cwd, output, relativePath);

    fsWriteSync(filepath, content);
    files.add(relativePath);
  });

const writeCompiledTypescriptFiles = (
  cwd: string,
  output: string,
  files: Set<string>,
) => {
  const tsFiles = Array.from(files).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".tsx"),
  );

  // ESM output
  tsCompile(cwd, output, tsFiles, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
  });

  // rename ESM output files
  tsFiles.forEach((relativePath) => {
    const absolutePath = join(
      cwd,
      output,
      relativePath.replace(/\.tsx?$/, ".js"),
    );
    files.add(relativePath.replace(/\.tsx?$/, ".mjs"));

    renameSync(absolutePath, absolutePath.replace(/\.js$/, ".mjs"));
  });

  // CommonJs output
  tsCompile(cwd, output, tsFiles);

  tsFiles.forEach((relativePath) => {
    files.add(relativePath.replace(/\.tsx?$/, ".js"));
    files.add(relativePath.replace(/\.tsx?$/, ".d.ts"));

    // remove TypeScript files
    files.delete(relativePath);
    rmSync(join(cwd, output, relativePath), { force: true });
  });

  tsCompile(cwd, output, tsFiles);

  tsFiles.forEach((relativePath) => {
    files.add(relativePath.replace(/\.tsx?$/, ".js"));
    files.add(relativePath.replace(/\.tsx?$/, ".d.ts"));

    // remove TypeScript files
    files.delete(relativePath);
    rmSync(join(cwd, output, relativePath), { force: true });
  });
};

const writeTranslationsFiles = async (
  cwd: string,
  output: string,
  { translationFiles }: I18nCompiler.DataInput,
  folders: Set<string>,
) =>
  Promise.all(
    translationFiles.map(async ({ data, locale, path }) => {
      const relativePath = join("translations", locale);
      await fsWrite(
        join(cwd, output, relativePath, path),
        JSON.stringify(data),
      );
      folders.add(relativePath);
    }),
  );

const writeTranslationsFilesSync = (
  cwd: string,
  output: string,
  { translationFiles }: I18nCompiler.DataInput,
  folders: Set<string>,
) =>
  translationFiles.forEach(({ data, locale, path }) => {
    const relativePath = join("translations", locale);
    fsWriteSync(join(cwd, output, relativePath, path), JSON.stringify(data));
    folders.add(relativePath);
  });

const getWriteGitgnoreArgs = (
  cwd: string,
  output: string,
  folders: Set<string>,
  files: Set<string>,
) =>
  [
    join(cwd, output, ".gitignore"),
    Array.from(new Set([...folders, ...files]))
      .sort()
      .map((relativePath) => `/${relativePath}`)
      .join(`\n`),
  ] as const;

export type CodeWriteOptions = {
  /**
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Relative to the given `cwd`.
   *
   * Use a _dot_ named folder in order to be automatically ignored when your
   * i18n source files live in the same folder as the generated code
   */
  output: string;
  skipTsCompile?: boolean;
  skipGitignore?: boolean;
  skipTranslations?: boolean;
};

export let writeCode = async (
  options: CodeWriteOptions,
  data: I18nCompiler.DataCode,
) => {
  const {
    cwd = process.cwd(),
    output,
    skipTsCompile,
    skipGitignore,
    skipTranslations,
  } = options;

  const code = await generateCode(data);
  const files: Set<string> = new Set();
  const folders: Set<string> = new Set();

  await writeCodeFiles(cwd, output, code, files);

  if (!skipTsCompile) {
    writeCompiledTypescriptFiles(cwd, output, files);
  }

  if (!skipTranslations) {
    await writeTranslationsFiles(cwd, output, data.input, folders);
  }

  if (!skipGitignore) {
    await fsWrite(...getWriteGitgnoreArgs(cwd, output, folders, files));
  }

  // TODO: maybe return written paths?
  return;
};

export let writeCodeSync = (
  options: CodeWriteOptions,
  data: I18nCompiler.DataCode,
) => {
  const {
    cwd = process.cwd(),
    output,
    skipTsCompile,
    skipGitignore,
    skipTranslations,
  } = options;

  const code = generateCodeSync(data);
  const files: Set<string> = new Set();
  const folders: Set<string> = new Set();

  writeCodeFilesSync(cwd, output, code, files);

  if (!skipTsCompile) {
    writeCompiledTypescriptFiles(cwd, output, files);
  }

  if (!skipTranslations) {
    writeTranslationsFilesSync(cwd, output, data.input, folders);
  }

  if (!skipGitignore) {
    fsWriteSync(...getWriteGitgnoreArgs(cwd, output, folders, files));
  }

  // TODO: maybe return written paths?
  return;
};
