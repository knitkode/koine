import { i18nCompiler } from "./compiler";

describe("test projects", () => {
  beforeAll(() => {
    // pretend we are not testing, these are affecting projects outside
    // of this library
    process.env["JEST_WORKER_ID"] = undefined;
    console.log(i18nCompiler.name);
  });

  test("pretending we are not testing should work", () => {
    expect(process.env["JEST_WORKER_ID"]).toBe("undefined");
  });

  // describe("test your.io", () => {
  //   test("mimic the github action behaviour", async () => {
  //     await i18nCompiler({
  //       baseUrl: "https://your.io",
  //       defaultLocale: "en",
  //       input: {
  //         source: "../../Your/translations",
  //         write: {
  //           output: "../../Your/translations/.github/input.json",
  //         },
  //       },
  //       code: {
  //         adapter: {
  //           name: "next",
  //           // options: {
  //           //   loader: false,
  //           // },
  //         },
  //       },
  //       summary: {
  //         sourceUrl:
  //           "https://github.com/your-network/translations/tree/development",
  //         write: {
  //           outputJson: "../../Your/translations/.github/summary.json",
  //           outputMarkdown: "../../Your/translations/.github/summary.md",
  //         },
  //       },
  //     });
  //   });
  //   test("mimic next plugin build", async () => {
  //     await i18nCompiler({
  //       baseUrl: "https://your.io",
  //       defaultLocale: "en",
  //       hideDefaultLocaleInUrl: true,
  //       // logLevel: 5,
  //       input: {
  //         source: "../../Your/translations",
  //         // source:
  //         //   "https://raw.githubusercontent.com/your-network/translations/dev/.github/input.json",
  //       },
  //       code: {
  //         adapter: {
  //           name: "next",
  //           options: {},
  //         },
  //         write: {
  //           ignorePaths: ["build.ts", "project.json", "tsconfig.json"],
  //           output: "../../Your/YOURContent/YOUR.Frontend/libs/i18n",
  //           tsconfig: {
  //             alias: "@/i18n",
  //             path: "../../Your/YOURContent/YOUR.Frontend/tsconfig.base.json",
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe("test yenvi.nl", () => {
  //   test("mimic next plugin build", async () => {
  //     await i18nCompiler({
  //       baseUrl: "https://yenvi.nl",
  //       defaultLocale: "en",
  //       hideDefaultLocaleInUrl: true,
  //       input: {
  //         source: "../../Daan/yenvi/translations",
  //       },
  //       code: {
  //         routes: {
  //           localeParamName: "lng",
  //         },
  //         adapter: {
  //           name: "next",
  //         },
  //         write: {
  //           output: "../../Daan/yenvi/i18n",
  //           tsconfig: {
  //             path: "../../Daan/yenvi/tsconfig.json",
  //             alias: "@/i18n",
  //           },
  //         },
  //       },
  //     });
  //   });
  // });
});
