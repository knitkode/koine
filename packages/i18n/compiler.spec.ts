import { join } from "path";
import { i18nCompiler } from "./compiler";

const mocksPath = join(process.cwd(), "/packages/i18n/__mocks__/");

describe("test write", () => {
  test("single-language setup", async () => {
    await i18nCompiler({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        cwd: join(mocksPath, "single-language"),
      },
    }).writeAll({
      code: {
        cwd: join(mocksPath, "single-language"),
        output: ".code",
        adapter: "next-translate",
        skipTsCompile: true,
        // skipGitignore: true,
        skipTranslations: true,
      },
      input: {
        cwd: join(mocksPath, "single-language"),
        output: "input.json",
        pretty: true,
      },
      summary: {
        cwd: join(mocksPath, "single-language"),
        outputJson: "summary.json",
        outputMarkdown: "summary.md",
        sourceUrl: "https://github.com/knitkode/koine/translations/tree/dev",
      },
    });
  });

  test("multi-language setup", async () => {
    await i18nCompiler({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        cwd: join(mocksPath, "multi-language"),
      },
    }).writeAll({
      code: {
        cwd: join(mocksPath, "multi-language"),
        output: ".code",
        adapter: "next-translate",
        skipTsCompile: true,
        // skipGitignore: true,
        skipTranslations: true,
      },
      input: {
        cwd: join(mocksPath, "multi-language"),
        output: "input.json",
        pretty: true,
      },
      summary: {
        cwd: join(mocksPath, "multi-language"),
        outputJson: "summary.json",
        outputMarkdown: "summary.md",
        sourceUrl: "https://github.com/knitkode/koine/translations/tree/dev",
      },
    });
  });
});

describe("test your.io", () => {
  test("mimic the github action behaviour", async () => {
    const i18n = i18nCompiler({
      input: {
        cwd: join(__dirname, "../../../../Your/translations"),
      },
    });

    await Promise.all([
      i18n.writeInput({
        cwd: join(__dirname, "../../../../Your/translations/.github"),
        output: "input.json",
      }),
      i18n.writeSummary({
        cwd: join(__dirname, "../../../../Your/translations/.github"),
        outputJson: "summary.json",
        outputMarkdown: "summary.md",
        sourceUrl: "https://github.com/your-network/translations/tree/dev",
      }),
    ]);
  });

  test("mimic next plugin build", async () => {
    await i18nCompiler({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        cwd: join(__dirname, "../../../../../Your/translations"),
      },
      // code: { translations: { fnsAsDataCodes: false } },
    }).writeCode({
      cwd: join(__dirname, "../../../../../Your/frontend"),
      output: "/libs/i18n",
      adapter: "next-translate",
      skipTsCompile: true,
    });
  });

  // await i18n.write.all({
  //   data: {
  //     cwd: join(__dirname, "../../../../../Your/translations")
  //     output: ".github/data.json",
  //   },
  //   code: {
  //     output: "../frontend/libs/i18n",
  //     adapter: "next-translate",
  //     skipTsCompile: true,
  //   },
  //   summary: {
  //     outputJson: ".github/summary.json",
  //     outputMarkdown: ".github/summary.md",
  //     sourceUrl: "https://github.com/your-network/translations/tree/dev",
  //   },
  // });
});
