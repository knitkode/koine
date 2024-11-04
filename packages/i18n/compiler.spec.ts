import { join } from "path";
import { wait } from "@koine/utils";
import { fsWrite } from "@koine/node";
import { type I18nCompiler, i18nCompiler } from "./compiler";
import type { InputDataOptions } from "./compiler/input/types";

// jest.unmock('mock-stdin');
// describe("test CLI", () => {
//   let stdin;
//   beforeEach(() => {
//     stdin = require('mock-stdin').stdin();
//   });
// })

describe("test in memory output", () => {
  const runCompiler = async (input: InputDataOptions) =>
    i18nCompiler({
      baseUrl: "https://example.com",
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input,
      code: {
        adapter: {
          name: "next",
          options: {
            modularize: false,
          },
        },
      },
    });

  const inputData: I18nCompiler.DataInput = {
    localesFolders: ["en"],
    translationFiles: [
      {
        path: "test.json",
        locale: "en",
        data: {},
      },
    ],
  };

  test("input source: direct as object or function sync/async", async () => {
    expect((await runCompiler({ source: inputData })).config.locales).toEqual([
      "en",
    ]);
    expect(
      (await runCompiler({ source: () => inputData })).config.locales,
    ).toEqual(["en"]);
    expect(
      (
        await runCompiler({
          source: async () => {
            wait(100);
            return inputData;
          },
        })
      ).config.locales,
    ).toEqual(["en"]);
    try {
      // @ts-expect-error wrong implementation
      await runCompiler({ source: {} });
    } catch (_e) {
      // nothing
    }
  });

  test("empty data set should not break", async () => {
    const emptyData = await runCompiler({
      source: {
        localesFolders: ["en"],
        translationFiles: [
          {
            path: "test.json",
            locale: "en",
            data: {},
          },
        ],
      },
    });
    expect(emptyData.config.locales).toEqual(["en"]);
    expect(emptyData.config.defaultLocale).toEqual("en");
    expect(emptyData.routes.byId).toEqual({});
    expect(emptyData.translations).toEqual({});
  });
});

const mocksPath = (folder: string) =>
  join(process.cwd(), "/packages/i18n/__mocks__/", folder);

describe("test written output", () => {
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
          name: "js",
          options: {
            modularize: true,
          },
        },
        routes: {},
        write: {
          cwd: mocksPath("single-language"),
          output: ".code",
          tsconfig: {
            alias: "@/i18n",
          },
          eslintDisable: true,
          tsNoCheck: true,
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
      // logLevel: 4,
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
          options: {
            modularize: false,
          },
        },
        write: {
          cwd: mocksPath("multi-language"),
          output: ".code",
          ignorePaths: ["createT.ts"],
          tsconfig: {
            alias: "@/i18n",
          },
          eslintDisable: true,
          tsNoCheck: true,
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

describe("test playground-next", () => {
  test("mimic next plugin build", async () => {
    await i18nCompiler({
      baseUrl: "http://localhost:4200",
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      input: {
        source: "./playground/next/translations",
      },
      code: {
        adapter: {
          name: "next",
          options: {},
        },
        write: {
          output: "./playground/next/i18n",
          // typescriptCompilation: true,
        },
      },
    });
  }, 40000);
});
