import { i18nCompiler } from "./compiler";

describe("test projects", () => {
  test("dummy test, uncomment what needed and then revert change", () => {
    expect(i18nCompiler.name).toBe(i18nCompiler.name);
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
        sourceUrl:
          "https://github.com/your-network/translations/tree/development",
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
          options: {},
        },
        write: {
          emptyOutputFolder: false,
          gitignore: false,
          output: "../../Your/YOURContent/YOUR.Frontend/libs/i18n",
          tsconfig: {
            alias: "@/i18n",
            path: "../../Your/YOURContent/YOUR.Frontend/tsconfig.base.json",
          },
        },
      },
    });
  });
});

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
