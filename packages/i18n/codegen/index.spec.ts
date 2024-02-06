// import { jestCreateExpectedThrownError } from "@koine/node/jest";
import { join } from "path";
import { to } from "./__mocks__/multi-language/.source/to";
import * as multiToFns from "./__mocks__/multi-language/.source/toFns";
import * as singleToFns from "./__mocks__/single-language/.source/toFns";
import { i18nCodegen } from "./index";

// const err = jestCreateExpectedThrownError("@koine/i18n", "to");

describe("generated sources: to", () => {
  test("all routes urls", () => {
    expect(singleToFns.to_about()).toEqual("/about");
    expect(multiToFns.to_about()).toEqual("/about");
    // expect(to("about")).toEqual("/about");
    expect(multiToFns.to_about("it")).toEqual("/it/chi-siamo");
    expect(to("about", "it")).toEqual("/it/chi-siamo");

    // @ts-expect-error test wrong implementation
    singleToFns.to_about("it");
    // @ts-expect-error test wrong implementation
    singleToFns.to_about("en");

    expect(multiToFns.to_accountUserId({ id: "a" })).toEqual("/account/user/a");
    expect(to("account.user.[id]", { id: "a" })).toEqual("/account/user/a");
  });
});

const mocksPath = join(process.cwd(), "/packages/i18n/codegen/__mocks__/");

describe("test write", () => {
  test("single-language setup", async () => {
    await i18nCodegen({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      fs: {
        cwd: join(mocksPath, "single-language"),
      },
    }).write.all({
      source: {
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
  });

  test("multi-language setup", async () => {
    await i18nCodegen({
      defaultLocale: "en",
      hideDefaultLocaleInUrl: true,
      fs: {
        cwd: join(mocksPath, "multi-language"),
      },
    }).write.all({
      source: {
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
  });
});

test("test your.io", async () => {
  await i18nCodegen({
    defaultLocale: "en",
    hideDefaultLocaleInUrl: true,
    fs: {
      cwd: join(__dirname, "../../../../../Your/translations"),
    },
    translations: {
      // fnsAsDataSources: false
    },
  }).write.source({
    output: "../frontend/libs/i18n",
    adapter: "next-translate",
    skipTsCompile: true,
  });
});
