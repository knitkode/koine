// import { jestCreateExpectedThrownError } from "@koine/node/jest";
import * as t from "./__mocks__/multi-language/.code/$t";
// import { to } from "./__mocks__/multi-language/.code/to";
import { createT } from "./__mocks__/multi-language/.code/createT";
// import { getI18nDictionaries } from "./__mocks__/multi-language/.code/getI18nDictionaries";
import * as multiTo from "./__mocks__/multi-language/.code/$to";
import * as singleTo from "./__mocks__/single-language/.code/$to";
import * as dictionaries_accountUserProfile from "./__mocks__/multi-language/.code/translations/en/~account/~user~profile.json";

// const err = jestCreateExpectedThrownError("@koine/i18n", "to");

describe("generated code: to", () => {
  test("all routes urls", () => {
    expect(singleTo.$to_about()).toEqual("/about");
    expect(multiTo.$to_about()).toEqual("/about");
    // expect(to("about")).toEqual("/about");
    expect(multiTo.$to_about("it")).toEqual("/it/chi-siamo");
    // expect(to("about", "it")).toEqual("/it/chi-siamo");

    // @ts-expect-error test wrong implementation
    singleTo.about("it");
    // @ts-expect-error test wrong implementation
    singleTo.about("en");

    expect(multiTo.$to_account_user_id({ id: "a" })).toEqual("/account/user/a");
    // expect(to("account.user.[id]", { id: "a" })).toEqual("/account/user/a");
  });
});

describe("generated code: t", () => {
  test("basic multilingual translate", () => {
    expect(t.$t_$404_seo_title()).toEqual("404 - Not found");
    expect(t.$t_$404_seo_title("it")).toEqual("404 - Introvabile");
  });

  test("returning objects and arrays", () => {
    expect(t.$t_$404_seo()).toEqual({ title: "404 - Not found" });
    expect(t.$t_$account_$user$profile_listFlat()).toEqual(["v1", "v2"]);
    expect(t.$t_$account_$user$profile_listComplex()).toEqual([{ k1: "v1", k2: "v2" }]);
  });

  test("interpolation", () => {
    expect(t.$t_$account_$user$profile_title({ varName: "is" })).toEqual("Title is");
  });

  test("pluralisation", () => {
    expect(t.$t_$account_$user$profile_plural({ who: "Foo", count: 1 })).toEqual("One Foo");
    expect(t.$t_$account_$user$profile_plural({ who: "Foo", count: 10 })).toEqual("Some Foo");
    // not to `Zero Foo` as English only has `_other` and `_one` plural forms!
    expect(t.$t_$account_$user$profile_plural({ who: "Foo", count: 0 })).toEqual("Some Foo") ;
    
    expect(t.$t_$account_$user$profile_plural({ who: "Foo", count: 1 }, "it")).toEqual("Uno Foo");
    expect(t.$t_$account_$user$profile_plural({ who: "Foo", count: 10 }, "it")).toEqual("Alcuni Foo");
    // not to `Nessuno Foo` as Italian only has `_other` and `_one` plural forms!
    expect(t.$t_$account_$user$profile_plural({ who: "Foo", count: 0 }, "it")).toEqual("Alcuni Foo");

    expect(t.$t_$account_$user$profile_pluralAsObjectWithExtraKeys_noPluralRelated()).toEqual("Yes");

    expect(t.$t_$account_$user$profile_pluralAsObject({ count: 1 })).toEqual("One");
    expect(t.$t_$account_$user$profile_pluralAsObject({ count: 10 })).toEqual("Others");
    expect(t.$t_$account_$user$profile_pluralAsObject({ count: 1 }, "it")).toEqual("Uno");
    expect(t.$t_$account_$user$profile_pluralAsObject({ count: 10 }, "it")).toEqual("Molti");

    expect(t.$t_$account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$1()).toEqual("One");
    expect(t.$t_$account_$user$profile_dontConsiderMeAPluralIDontHaveOther("it")[1]).toEqual("Uno");
  });
});

describe("createT", () => {
  test("should return t function that interpolates", async () => {
    const ns = "~account/~user~profile" as const;
    const dictionaries = { [ns]: dictionaries_accountUserProfile };
    // const dictionaries = await getI18nDictionaries({ locale: "en", namespaces: [
    //   ns
    // ]})
    const t = createT(dictionaries as any, new Intl.PluralRules());

    expect(typeof t).toBe("function");
    expect(t(`${ns}:title`, { varName: "here" })).toBe("Title here");
    // expect(t("", null, { returnObjects: true })).toEqual(nsRootKeys)
  })
})
