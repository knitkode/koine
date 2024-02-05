import { join } from "node:path";
import { write } from "./write";
import { writeSource } from "./writeSource";

const mocksPath = join(process.cwd(), "/packages/i18n/codegen/__mocks__/");

describe("test write", () => {
  test("single-language setup", async () => {
    await write({
      cwd: join(mocksPath, "single-language"),
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      source: {
        output: "source",
        adapter: "next-translate",
        skipTsCompile: true,
        skipGitignore: true,
        skipTranslations: true,
      },
      summary: {
        outputJson: "summary.json",
        outputMarkdown: "summary.md",
        sourceUrl: "https://github.com/your-network/translations/tree/dev",
      },
    });
  }, 10000);

  test("multi-language setup", async () => {
    await write({
      cwd: join(mocksPath, "multi-language"),
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      source: {
        output: "source",
        adapter: "next-translate",
        skipTsCompile: true,
        skipGitignore: true,
        skipTranslations: true,
      },
      summary: {
        outputJson: "summary.json",
        outputMarkdown: "summary.md",
        sourceUrl: "https://github.com/your-network/translations/tree/dev",
      },
    });
  }, 10000);
});

test("test your.io", async () => {
  await writeSource({
    cwd: join(__dirname, "../../../../../Your/translations"),
    defaultLocale: "en",
    hideDefaultLocaleInUrl: true,
    output: "../frontend/libs/i18n",
    adapter: "next-translate",
    skipTsCompile: true,
    // skipGitignore: true
    // skipTranslations: true,
  });
  // await write({
  //   cwd: join(__dirname, "../../../../../Your/translations"),
  //   defaultLocale: "en",
  //   hideDefaultLocaleInUrl: true,
  //   source: {
  //     output: "../frontend/libs/i18n/automated",
  //     skipTsCompile: true,
  //   },
  //   summary: {
  //     outputJson: "summary.json",
  //     outputMarkdown: "summary.md",
  //     sourceUrl: "https://github.com/your-network/translations/tree/dev",
  //   },
  // });
}, 10000);
