import { rmSync } from "node:fs";
import { cp } from "node:fs/promises";
import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nGenerateSourceConfig,
  generateSource,
} from "./generateSource";
import { getFsData } from "./getFsData";
import { I18nGenerate } from "./types";
import { writeSourceCompiled } from "./writeSourceCompiled";

export type WriteSourceOptions = {
  cwd: string;
  output: string;
  skipTsCompile?: boolean;
  skipGitignore?: boolean;
  skipTranslations?: boolean;
} & I18nGenerateSourceConfig;

export async function writeSource(options: WriteSourceOptions) {
  const {
    cwd,
    output,
    skipTsCompile,
    skipGitignore,
    skipTranslations,
    ...configSource
  } = options;

  const data = await getFsData({ ...options, ignore: [output + "/**"] });
  const sources = await generateSource({ ...data, ...configSource });

  const prettifiablePaths: Set<string> = new Set();
  const writtenFiles: Set<string> = new Set();
  const writtenFolders: Set<string> = new Set();

  await Promise.all(
    sources.map(async ({ name, ext, content }) => {
      const relativePath = `${name}.${ext}`;
      const filepath = join(cwd, output, relativePath);

      await fsWrite(filepath, content);
      writtenFiles.add(relativePath);
      prettifiablePaths.add(filepath);
    }),
  );

  if (!skipTsCompile) {
    const tsFiles = Array.from(writtenFiles).filter(
      (source) => source.endsWith(".ts") || source.endsWith(".tsx"),
    );
    await writeSourceCompiled(options, tsFiles);

    Array.from(tsFiles).forEach((relativePath) => {
      writtenFiles.add(relativePath.replace(/\.tsx?$/, ".js"));
      writtenFiles.add(relativePath.replace(/\.tsx?$/, ".d.ts"));

      // remove TypeScript source file
      const filepath = join(cwd, output, relativePath);
      rmSync(filepath, { force: true });
      writtenFiles.delete(relativePath);
    });
  }

  if (!skipTranslations) {
    (await copyTranslations(options, data)).forEach((relativePath) => {
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

  return data;
}

async function copyTranslations(
  options: WriteSourceOptions,
  data: I18nGenerate.Data,
) {
  const { cwd, output } = options;
  return await Promise.all(
    data.localesFolders.map(async ({ path, code }) => {
      const relativePath = join("translations", code);
      await cp(path, join(cwd, output, relativePath), {
        recursive: true,
        force: true,
        preserveTimestamps: true,
      });
      return relativePath;
    }),
  );
}
