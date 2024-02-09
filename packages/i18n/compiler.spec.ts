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
        write: {
          cwd: join(mocksPath, "single-language"),
          output: "input.json",
          pretty: true,
        },
      },
      code: {
        adapter: "next-translate",
        write: {
          cwd: join(mocksPath, "single-language"),
          output: ".code",
          skipTsCompile: true,
          // skipGitignore: true,
          skipTranslations: true,
        },
      },
      summary: {
        sourceUrl: "https://github.com/knitkode/koine/translations/tree/dev",
        write: {
          cwd: join(mocksPath, "single-language"),
          outputJson: "summary.json",
          outputMarkdown: "summary.md",
        },
      },
    });
  });

  test("multi-language setup", async () => {
    await i18nCompiler({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        cwd: join(mocksPath, "multi-language"),
        write: {
          cwd: join(mocksPath, "multi-language"),
          output: "input.json",
          pretty: true,
        },
      },
      code: {
        adapter: "next-translate",
        write: {
          cwd: join(mocksPath, "multi-language"),
          output: ".code",
          skipTsCompile: true,
          // skipGitignore: true,
          skipTranslations: true,
        },
      },
      summary: {
        sourceUrl: "https://github.com/knitkode/koine/translations/tree/dev",
        write: {
          cwd: join(mocksPath, "multi-language"),
          outputJson: "summary.json",
          outputMarkdown: "summary.md",
        },
      },
    });
  });
});

describe("test your.io", () => {
  test("mimic the github action behaviour", async () => {
    await i18nCompiler({
      input: {
        cwd: join(__dirname, "../../../../Your/translations"),
        write: {
          cwd: join(__dirname, "../../../../Your/translations/.github"),
          output: "input.json",
        },
      },
      summary: {
        sourceUrl: "https://github.com/your-network/translations/tree/dev",
        write: {
          cwd: join(__dirname, "../../../../Your/translations/.github"),
          outputJson: "summary.json",
          outputMarkdown: "summary.md",
        },
      },
    });
  });

  test("mimic next plugin build", async () => {
    await i18nCompiler({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        mode: "url",
        cwd: join(process.cwd(), "../../Your/translations"),
        url: "https://raw.githubusercontent.com/your-network/translations/dev/.github/input.json",
      },
      code: {
        adapter: "next-translate",
        write: {
          cwd: join(process.cwd(), "../../Your/frontend"),
          output: "/libs/i18n",
          skipTsCompile: true,
        },
      },
    });
  });
});
