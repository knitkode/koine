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

  const writtenSources: Set<string> = new Set();
  const writtenFolders: Set<string> = new Set();

  await Promise.all(
    sources.map(async ({ name, ext, content }) => {
      const relativePath = `${name}.${ext}`;
      const filepath = join(cwd, output, relativePath);

      await fsWrite(filepath, content);
      writtenSources.add(relativePath);
    }),
  );

  if (!skipTsCompile) {
    await writeSourceCompiled(
      options,
      Array.from(writtenSources).filter(
        (source) => source.endsWith(".ts") || source.endsWith(".tsx"),
      ),
    );
    Array.from(writtenSources).forEach((relativePath) => {
      writtenSources.add(relativePath.replace(".tsx", ".js"));
      writtenSources.add(relativePath.replace(".ts", ".js"));
      writtenSources.add(relativePath.replace(".ts", ".d.ts"));
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
      Array.from(new Set([...writtenFolders, ...writtenSources]))
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
