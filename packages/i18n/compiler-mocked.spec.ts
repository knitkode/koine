// import { jestCreateExpectedThrownError } from "@koine/node/jest";
import * as t from "./__mocks__/multi-language/.code/tFns";
import { to } from "./__mocks__/multi-language/.code/to";
import * as multiToFns from "./__mocks__/multi-language/.code/toFns";
import * as singleToFns from "./__mocks__/single-language/.code/toFns";

// const err = jestCreateExpectedThrownError("@koine/i18n", "to");

describe("generated code: to", () => {
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

describe("generated code: tFns", () => {
  test("t", () => {
    expect(t.$404_seo_title()).toEqual("404 - Not found");
  });
});
