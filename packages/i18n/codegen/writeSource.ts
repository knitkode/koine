import { rmSync } from "node:fs";
import { cp } from "node:fs/promises";
import { join } from "node:path";
import { fsWrite } from "@koine/node";
import {
  type I18nCodegenSourceOptions,
  generateSource,
} from "./generateSource";
import { getDataFs } from "./getDataFs";
import { getDataSource } from "./getDataSource";
import type { I18nCodegen } from "./types";
import { writeSourceCompiled } from "./writeSourceCompiled";

type WriteSourceConfig = {
  cwd: string;
  /**
   * This should be a _dot_ folder in order to be automatically ignored by
   * {@link ./getDataFs.ts}
   *
   * @default ".source"
   */
  output: string;
  skipTsCompile?: boolean;
  skipGitignore?: boolean;
  skipTranslations?: boolean;
} & I18nCodegenSourceOptions;

export type WriteSourceOptions = Partial<WriteSourceConfig>;

export let writeSource = async (
  {
    cwd = process.cwd(),
    output = ".source",
    skipTsCompile,
    skipGitignore,
    skipTranslations,
    ...restOptions
  }: WriteSourceOptions = {},
  config: I18nCodegen.Config,
  dataFs?: I18nCodegen.DataFs,
  dataSource?: I18nCodegen.DataSource,
) => {
  dataFs = dataFs || (await getDataFs({ cwd }));
  dataSource = dataSource || (await getDataSource(config, dataFs));
  const sources = await generateSource(
    {
      config,
      data: {
        fs: dataFs,
        source: dataSource,
      },
    },
    restOptions,
  );

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
    await writeSourceCompiled(cwd, output, tsFiles);

    Array.from(tsFiles).forEach((relativePath) => {
      writtenFiles.add(relativePath.replace(/\.tsx?$/, ".js"));
      writtenFiles.add(relativePath.replace(/\.tsx?$/, ".d.ts"));

      // remove TypeScript source file
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
  { locales }: I18nCodegen.Config,
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
