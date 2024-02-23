// import { jestCreateExpectedThrownError } from "@koine/node/jest";
import * as t from "./__mocks__/multi-language/.code/tFns";
import { to } from "./__mocks__/multi-language/.code/to";
import * as multiToFns from "./__mocks__/multi-language/.code/toFns";
import * as singleToFns from "./__mocks__/single-language/.code/toFns";

// const err = jestCreateExpectedThrownError("@koine/i18n", "to");

describe("generated code: to", () => {
  test("all routes urls", () => {
    expect(singleToFns.about()).toEqual("/about");
    expect(multiToFns.about()).toEqual("/about");
    // expect(to("about")).toEqual("/about");
    expect(multiToFns.about("it")).toEqual("/it/chi-siamo");
    expect(to("about", "it")).toEqual("/it/chi-siamo");

    // @ts-expect-error test wrong implementation
    singleToFns.about("it");
    // @ts-expect-error test wrong implementation
    singleToFns.about("en");

    expect(multiToFns.account_user_id({ id: "a" })).toEqual("/account/user/a");
    expect(to("account.user.[id]", { id: "a" })).toEqual("/account/user/a");
  });
});

describe("generated code: tFns", () => {
  test("basic multilingual translate", () => {
    expect(t.$404_seo_title()).toEqual("404 - Not found");
    expect(t.$404_seo_title("it")).toEqual("404 - Introvabile");
  });

  test("returning objects and arrays", () => {
    expect(t.$404_seo()).toEqual({ title: "404 - Not found" });
    expect(t.$account_$user$profile_listFlat()).toEqual(["v1", "v2"]);
    expect(t.$account_$user$profile_listComplex()).toEqual([{ k1: "v1", k2: "v2" }]);
  });

  test("interpolation", () => {
    expect(t.$account_$user$profile_title({ varName: "is" })).toEqual("Title is");
  });

  test("pluralisation", () => {
    expect(t.$account_$user$profile_plural({ who: "Foo", count: 1 })).toEqual("One Foo");
    expect(t.$account_$user$profile_plural({ who: "Foo", count: 10 })).toEqual("Some Foo");
    // not to `Zero Foo` as English only has `_other` and `_one` plural forms!
    expect(t.$account_$user$profile_plural({ who: "Foo", count: 0 })).toEqual("Some Foo") ;
    
    expect(t.$account_$user$profile_plural({ who: "Foo", count: 1 }, "it")).toEqual("Uno Foo");
    expect(t.$account_$user$profile_plural({ who: "Foo", count: 10 }, "it")).toEqual("Alcuni Foo");
    // not to `Nessuno Foo` as Italian only has `_other` and `_one` plural forms!
    expect(t.$account_$user$profile_plural({ who: "Foo", count: 0 }, "it")).toEqual("Alcuni Foo");

    expect(t.$account_$user$profile_pluralAsObjectWithExtraKeys_noPluralRelated()).toEqual("Yes");

    expect(t.$account_$user$profile_pluralAsObject({ count: 1 })).toEqual("One");
    expect(t.$account_$user$profile_pluralAsObject({ count: 10 })).toEqual("Others");
    expect(t.$account_$user$profile_pluralAsObject({ count: 1 }, "it")).toEqual("Uno");
    expect(t.$account_$user$profile_pluralAsObject({ count: 10 }, "it")).toEqual("Molti");

    expect(t.$account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$1()).toEqual("One");
    expect(t.$account_$user$profile_dontConsiderMeAPluralIDontHaveOther("it")[1]).toEqual("Uno");
  });
});
