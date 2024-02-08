import { join } from "path";
import { i18nCompiler, i18nStandalone } from "./compiler";

const mocksPath = join(process.cwd(), "/packages/i18n/__mocks__/");

describe("test write", () => {
  test("single-language setup", async () => {
    await i18nCompiler({
      config: {
        defaultLocale: "en",
        hideDefaultLocaleInUrl: true,
      },
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
      config: {
        defaultLocale: "en",
        hideDefaultLocaleInUrl: true,
      },
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
    await i18nStandalone({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        // cwd: join(process.cwd(), "../../Your/translations")
        url: "https://raw.githubusercontent.com/your-network/translations/dev/.github/input.json",
      },
      code: {
        write: {
          cwd: join(process.cwd(), "../../Your/frontend"),
          output: "/libs/i18n",
          // cwd: join(__dirname, "__mocks__"),
          // output: "xxxx",
          adapter: "next-translate",
          skipTsCompile: true,
        },
      },
    })();
    // await i18nCompiler({
    //   config: {
    //     defaultLocale: "en",
    //     hideDefaultLocaleInUrl: true,
    //   },
    //   input: {
    //     // cwd: join(process.cwd(), "../../Your/translations")
    //     // url: "https://raw.githubusercontent.com/your-network/translations/dev/.github/input.json",
    //   },
    //   // code: { translations: { fnsAsDataCodes: false } },
    // }).writeCode({
    //   cwd: join(process.cwd(), "../../Your/frontend"),
    //   output: "/libs/i18n",
    //   // cwd: join(__dirname, "__mocks__"),
    //   // output: "xxxx",
    //   adapter: "next-translate",
    //   skipTsCompile: true,
    // });
  });
});
