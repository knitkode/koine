// import { jestCreateExpectedThrownError } from "@koine/node/jest";
import * as t from "./__mocks__/multi-language/.code/$t";
import { to } from "./__mocks__/multi-language/.code/to";
import { createT } from "./__mocks__/multi-language/.code";
import * as multiTo from "./__mocks__/multi-language/.code/$to";
import * as singleTo from "./__mocks__/single-language/.code/$to";
import * as dictionary_accountUserProfile from "./__mocks__/multi-language/.code/translations/en/~account/~user~profile.json";

// const err = jestCreateExpectedThrownError("@koine/i18n", "to");

describe("generated code: to", () => {
  test("all routes urls", () => {
    expect(to("about")).toEqual("/about");
    expect(to("about", "it")).toEqual("/it/chi-siamo");
    expect(to("account.user.[id]", { id: "a" })).toEqual("/account/user/a");
    
    expect(multiTo.$to_about()).toEqual("/about");
    expect(multiTo.$to_about("it")).toEqual("/it/chi-siamo");
    expect(multiTo.$to_account_user_id({ id: "a" })).toEqual("/account/user/a");
    
    expect(singleTo.$to_about()).toEqual("/about");
    singleTo.$to_about(
      // @ts-expect-error test wrong implementation
      "it"
    );
    // test right implementation
    singleTo.$to_about("en");
    singleTo.$to_about();

  });
});

describe("generated code: t", () => {
  test("basic multilingual translate", () => {
    expect(t.$t_404_seo_title()).toEqual("404 - Not found");
    expect(t.$t_404_seo_title("it")).toEqual("404 - Introvabile");
  });

  test("returning objects and arrays", () => {
    expect(t.$t_404_seo()).toEqual({ title: "404 - Not found" });
    expect(t.$t_account_user_profile_listFlat()).toEqual(["v1", "v2"]);
    expect(t.$t_account_user_profile_listComplex()).toEqual([{ k1: "v1", k2: "v2" }]);
  });

  test("interpolation", () => {
    expect(t.$t_account_user_profile_title({ varName: "is" })).toEqual("Title is");
  });

  test("pluralisation", () => {
    expect(t.$t_account_user_profile_plural({ who: "Foo", count: 1 })).toEqual("One Foo");
    expect(t.$t_account_user_profile_plural({ who: "Foo", count: 10 })).toEqual("Some Foo");
    // not equal to `Zero Foo` as English only has `_other` and `_one` plural forms!
    expect(t.$t_account_user_profile_plural({ who: "Foo", count: 0 })).toEqual("Some Foo") ;
    
    expect(t.$t_account_user_profile_plural({ who: "Foo", count: 1 }, "it")).toEqual("Uno Foo");
    expect(t.$t_account_user_profile_plural({ who: "Foo", count: 10 }, "it")).toEqual("Alcuni Foo");
    // not equal to `Nessuno Foo` as Italian only has `_other` and `_one` plural forms!
    expect(t.$t_account_user_profile_plural({ who: "Foo", count: 0 }, "it")).toEqual("Alcuni Foo");

    expect(t.$t_account_user_profile_pluralAsObjectWithExtraKeys_noPluralRelated()).toEqual("Yes");

    expect(t.$t_account_user_profile_pluralAsObject({ count: 1 })).toEqual("One");
    expect(t.$t_account_user_profile_pluralAsObject({ count: 10 })).toEqual("Others");
    expect(t.$t_account_user_profile_pluralAsObject({ count: 1 }, "it")).toEqual("Uno");
    expect(t.$t_account_user_profile_pluralAsObject({ count: 10 }, "it")).toEqual("Molti");

    expect(t.$t_account_user_profile_dontConsiderMeAPluralIDontHaveOther_1()).toEqual("One");
    expect(t.$t_account_user_profile_dontConsiderMeAPluralIDontHaveOther_1("it")).toEqual("Uno");

    // TODO: jest seems to encounter a limit in filename length when writing
    // the files, hence for instance the following t function's file does not get
    // written to disk... Check whether we can overcome this limitation
    // t.$t_$account_$user$profile_obj_objNested_listComplexNested({ })
  });

  test("translations as data", () => {
    expect(t.$t_account_user_profile_obj_objNested_objNested2().listFlatNested22[0]).toEqual("v1");
  });
});

describe("createT", () => {
  const t = createT(dictionary_accountUserProfile, "en");

  test("should return t function that interpolates", async () => {
    expect(typeof t).toBe("function");
    expect(t("title", { varName: "here" })).toBe("Title here");
  })
  
  test("should be able to use a non-plural related value in a plural defined object", async () => {
    expect(t("pluralAsObjectWithExtraKeys.noPluralRelated")).toBe("Yes")
  })

  test("createT dictionary", async () => {
    const dictionary = {
      a: "a",
      b: 1,
      c: {
        a: "ca",
        b: "cb"
      },
      d: {
        a: "hi {{ name }}",
        b: ["db1", "db2 {{ name }}"],
        c: {
          a: "dca",
          b: "dcb {{ name }}"
        }
      }
    } as const;
    const t = createT(dictionary, new Intl.PluralRules())

    // const value = t("a");
    expect(t("a")).toBe("a");
    expect(t("b")).toBe(1);
    expect(t("c")).toBe(dictionary.c);
    expect(t("c.b")).toBe("cb");
    expect(t("c.a")).toBe("ca");
    expect(t("d.a", { name: "mate" })).toBe("hi mate");
    expect(t("d", { name: "mate" })).toEqual({
      a: "hi mate",
      b: ["db1", "db2 mate"],
      c: {
        a: "dca",
        b: "dcb mate"
      }
    });

  })
})
