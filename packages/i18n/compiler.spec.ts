import { join } from "path";
import { fsWrite } from "@koine/node";
import { i18nCompiler } from "./compiler";

const mocksPath = (folder: string) =>
  join(process.cwd(), "/packages/i18n/__mocks__/", folder);

describe("test write", () => {
  test("single-language setup", async () => {
    const data = await i18nCompiler({
      baseUrl: "https://example.com",
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        cwd: mocksPath("single-language"),
        source: ".",
        write: {
          cwd: mocksPath("single-language"),
          output: "input.json",
          pretty: true,
        },
      },
      code: {
        adapter: {
          name: "next",
          // options: {
          //   loader: false,
          // },
        },
        write: {
          cwd: mocksPath("single-language"),
          output: ".code",
          skipTsCompile: true,
          // skipTranslations: true,
        },
      },
      summary: {
        sourceUrl: "https://github.com/knitkode/koine/translations/tree/dev",
        write: {
          cwd: mocksPath("single-language"),
          outputJson: "summary.json",
          outputMarkdown: "summary.md",
        },
      },
    });

    await fsWrite(
      join(mocksPath("single-language"), "data.json"),
      JSON.stringify(data, null, 2),
    );
  });

  test("multi-language setup", async () => {
    const data = await i18nCompiler({
      baseUrl: "https://example.com",
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        cwd: mocksPath("multi-language"),
        source: ".",
        write: {
          cwd: mocksPath("multi-language"),
          output: "input.json",
          pretty: true,
        },
      },
      code: {
        adapter: {
          name: "next",
          // options: {
          //   loader: false,
          // },
        },
        write: {
          cwd: mocksPath("multi-language"),
          output: ".code",
          skipTsCompile: true,
          // skipTranslations: true,
        },
      },
      summary: {
        sourceUrl: "https://github.com/knitkode/koine/translations/tree/dev",
        write: {
          cwd: mocksPath("multi-language"),
          outputJson: "summary.json",
          outputMarkdown: "summary.md",
        },
      },
    });

    await fsWrite(
      join(mocksPath("multi-language"), "data.json"),
      JSON.stringify(data, null, 2),
    );
  });
});

describe("test your.io", () => {
  test("mimic the github action behaviour", async () => {
    await i18nCompiler({
      baseUrl: "https://your.io",
      defaultLocale: "en",
      input: {
        source: "../../Your/translations",
        write: {
          output: "../../Your/translations/.github/input.json",
        },
      },
      code: {
        adapter: {
          name: "next",
          // options: {
          //   loader: false,
          // },
        },
      },
      summary: {
        sourceUrl: "https://github.com/your-network/translations/tree/dev",
        write: {
          outputJson: "../../Your/translations/.github/summary.json",
          outputMarkdown: "../../Your/translations/.github/summary.md",
        },
      },
    });
  });

  test("mimic next plugin build", async () => {
    await i18nCompiler({
      baseUrl: "https://your.io",
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        source: "../../Your/translations",
        // source:
        //   "https://raw.githubusercontent.com/your-network/translations/dev/.github/input.json",
      },
      code: {
        adapter: {
          name: "next",
          options: {
            router: "app",
          },
        },
        write: {
          output: "../../Your/frontend/libs/i18n",
          skipTsCompile: true,
        },
      },
    });
  });
});

describe("test yenvi.nl", () => {
  test("mimic next plugin build", async () => {
    await i18nCompiler({
      baseUrl: "https://yenvi.nl",
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        source: "../../Daan/yenvi/translations",
      },
      code: {
        adapter: {
          name: "next",
          options: {
            router: "migrating",
          },
        },
        write: {
          output: "../../Daan/yenvi/i18n",
          skipTsCompile: true,
        },
      },
    });
  });
});
