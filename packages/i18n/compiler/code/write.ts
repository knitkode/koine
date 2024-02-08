import { rmSync } from "node:fs";
import { cp } from "node:fs/promises";
import { join } from "node:path";
import { fsWrite } from "@koine/node";
import type { I18nCompiler } from "../types";
import { type GenerateCodeOptions, generateCode } from "./generate";
import { tsCompile } from "./tsCompile";

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
  config: I18nCompiler.Config;
  data: {
    input: I18nCompiler.DataInput;
    code: I18nCompiler.DataCode;
  };
} & GenerateCodeOptions;

export let writeCode = async (options: CodeWriteOptions) => {
  const {
    cwd = process.cwd(),
    output,
    skipTsCompile,
    skipGitignore,
    skipTranslations,
    config,
    data,
    ...restOptions
  } = options;
  const generatedFiles = await generateCode(
    {
      config,
      data,
    },
    restOptions,
  );

  const prettifiablePaths: Set<string> = new Set();
  const writtenFiles: Set<string> = new Set();
  const writtenFolders: Set<string> = new Set();

  await Promise.all(
    generatedFiles.map(async ({ name, ext, content }) => {
      const relativePath = `${name}.${ext}`;
      const filepath = join(cwd, output, relativePath);

      await fsWrite(filepath, content);
      writtenFiles.add(relativePath);
      prettifiablePaths.add(filepath);
    }),
  );

  if (!skipTsCompile) {
    const tsFiles = Array.from(writtenFiles).filter(
      (f) => f.endsWith(".ts") || f.endsWith(".tsx"),
    );
    await tsCompile(cwd, output, tsFiles);

    tsFiles.forEach((relativePath) => {
      writtenFiles.add(relativePath.replace(/\.tsx?$/, ".js"));
      writtenFiles.add(relativePath.replace(/\.tsx?$/, ".d.ts"));

      // remove TypeScript files
      writtenFiles.delete(relativePath);
      rmSync(join(cwd, output, relativePath), { force: true });
    });
  }

  if (!skipTranslations) {
    (await copyTranslations(cwd, config, output)).forEach((relativePath) => {
      writtenFolders.add(relativePath);
    });
  }

  if (!skipGitignore) {
    await fsWrite(
      join(cwd, output, ".gitignore"),
      Array.from(new Set([...writtenFolders, ...writtenFiles]))
        .sort()
        .map((relativePath) => `/${relativePath}`)
        .join(`\n`),
    );
  }

  // TODO: maybe return written paths?
  return;
};

async function copyTranslations(
  cwd: string,
  { locales }: I18nCompiler.SharedConfig,
  output: string,
) {
  return await Promise.all(
    locales.map(async (locale) => {
      const relativePath = join("translations", locale);
      await cp(join(cwd, locale), join(cwd, output, relativePath), {
        recursive: true,
        force: true,
        preserveTimestamps: true,
      });
      return relativePath;
    }),
  );
}
