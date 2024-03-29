/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable prefer-const */
import { tInterpolateParams } from "./tInterpolateParams";
import { tPluralise } from "./tPluralise";
import type { I18n } from "./types";

export let $404_onlyNumberKeys = (locale?: I18n.Locale) =>
  locale === "it"
    ? { "1": "Una volta", "2": "Due volte", "3": "Tre volte" }
    : { "1": "Once", "2": "Twice", "3": "Three times" };
export let $404_onlyNumberKeys_$1 = (locale?: I18n.Locale) =>
  locale === "it" ? "Una volta" : "Once";
export let $404_onlyNumberKeys_$2 = (locale?: I18n.Locale) =>
  locale === "it" ? "Due volte" : "Twice";
export let $404_onlyNumberKeys_$3 = (locale?: I18n.Locale) =>
  locale === "it" ? "Tre volte" : "Three times";
export let $404_seo = (locale?: I18n.Locale) =>
  locale === "it"
    ? { title: "404 - Introvabile" }
    : { title: "404 - Not found" };
export let $404_seo_title = (locale?: I18n.Locale) =>
  locale === "it" ? "404 - Introvabile" : "404 - Not found";
export let $404_title = (locale?: I18n.Locale) =>
  locale === "it" ? "404, pagina non trovata" : "404, page not found";
export let $account_$user$profile_boolShouldntBeHereBut = (
  locale?: I18n.Locale,
) => true;
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther = (
  locale?: I18n.Locale,
) =>
  locale === "it"
    ? { "1": "Uno", "2": "Due", "3": "Tre" }
    : { "1": "One", "2": "Two", "3": "Three" };
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$1 = (
  locale?: I18n.Locale,
) => (locale === "it" ? "Uno" : "One");
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$2 = (
  locale?: I18n.Locale,
) => (locale === "it" ? "Due" : "Two");
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$3 = (
  locale?: I18n.Locale,
) => (locale === "it" ? "Tre" : "Three");
export let $account_$user$profile_listComplex = (locale?: I18n.Locale) => [
  { k1: "v1", k2: "v2" },
];
export let $account_$user$profile_listFlat = (locale?: I18n.Locale) => [
  "v1",
  "v2",
];
export let $account_$user$profile_obj = (locale?: I18n.Locale) =>
  locale === "it"
    ? {
        objNested: {
          str: "v",
          listFlatNested: ["v1", "v2"],
          listComplexNested: [
            {
              k1: "v1 ita {{ nestedVarName1 }}",
              k2: "v2 {{ nestedVarName2 }}",
            },
          ],
          objNested2: {
            objNested21: { k: "v" },
            listFlatNested22: ["v1", "v2"],
            str3: "v",
          },
          objNested2b: {
            str2b1: "v",
            str2b2: "v",
            listFlatNested2b3: ["v1", "v2"],
            str2b4: "v",
          },
        },
      }
    : {
        objNested: {
          str: "v",
          listFlatNested: ["v1", "v2"],
          listComplexNested: [
            { k1: "v1 en {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" },
          ],
          objNested2: {
            objNested21: { k: "v" },
            listFlatNested22: ["v1", "v2"],
            str3: "v",
          },
          objNested2b: {
            str2b1: "v",
            str2b2: "v",
            listFlatNested2b3: ["v1", "v2"],
            str2b4: "v",
          },
        },
      };
export let $account_$user$profile_obj_objNested = (locale?: I18n.Locale) =>
  locale === "it"
    ? {
        str: "v",
        listFlatNested: ["v1", "v2"],
        listComplexNested: [
          { k1: "v1 ita {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" },
        ],
        objNested2: {
          objNested21: { k: "v" },
          listFlatNested22: ["v1", "v2"],
          str3: "v",
        },
        objNested2b: {
          str2b1: "v",
          str2b2: "v",
          listFlatNested2b3: ["v1", "v2"],
          str2b4: "v",
        },
      }
    : {
        str: "v",
        listFlatNested: ["v1", "v2"],
        listComplexNested: [
          { k1: "v1 en {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" },
        ],
        objNested2: {
          objNested21: { k: "v" },
          listFlatNested22: ["v1", "v2"],
          str3: "v",
        },
        objNested2b: {
          str2b1: "v",
          str2b2: "v",
          listFlatNested2b3: ["v1", "v2"],
          str2b4: "v",
        },
      };
export let $account_$user$profile_obj_objNested_listComplexNested = (
  locale?: I18n.Locale,
) =>
  locale === "it"
    ? [{ k1: "v1 ita {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" }]
    : [{ k1: "v1 en {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" }];
export let $account_$user$profile_obj_objNested_listFlatNested = (
  locale?: I18n.Locale,
) => ["v1", "v2"];
export let $account_$user$profile_obj_objNested_objNested2 = (
  locale?: I18n.Locale,
) => ({ objNested21: { k: "v" }, listFlatNested22: ["v1", "v2"], str3: "v" });
export let $account_$user$profile_obj_objNested_objNested2_listFlatNested22 = (
  locale?: I18n.Locale,
) => ["v1", "v2"];
export let $account_$user$profile_obj_objNested_objNested2_objNested21 = (
  locale?: I18n.Locale,
) => ({ k: "v" });
export let $account_$user$profile_obj_objNested_objNested2_objNested21_k = (
  locale?: I18n.Locale,
) => "v";
export let $account_$user$profile_obj_objNested_objNested2_str3 = (
  locale?: I18n.Locale,
) => "v";
export let $account_$user$profile_obj_objNested_objNested2b = (
  locale?: I18n.Locale,
) => ({
  str2b1: "v",
  str2b2: "v",
  listFlatNested2b3: ["v1", "v2"],
  str2b4: "v",
});
export let $account_$user$profile_obj_objNested_objNested2b_listFlatNested2b3 =
  (locale?: I18n.Locale) => ["v1", "v2"];
export let $account_$user$profile_obj_objNested_objNested2b_str2b1 = (
  locale?: I18n.Locale,
) => "v";
export let $account_$user$profile_obj_objNested_objNested2b_str2b2 = (
  locale?: I18n.Locale,
) => "v";
export let $account_$user$profile_obj_objNested_objNested2b_str2b4 = (
  locale?: I18n.Locale,
) => "v";
export let $account_$user$profile_obj_objNested_str = (locale?: I18n.Locale) =>
  "v";
export let $account_$user$profile_plural = (
  params: { who: string | number; count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise(
      locale === "it"
        ? {
            one: "Uno {{ who }}",
            other: "Alcuni {{ who }}",
            zero: "Nessuno {{ who }}",
          }
        : {
            one: "One {{ who }}",
            other: "Some {{ who }}",
            zero: "Zero {{ who }}",
          },
      params.count,
    ),
    params,
  );
export let $account_$user$profile_pluralAsObject = (
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise(
      locale === "it"
        ? { one: "Uno", other: "Molti" }
        : { one: "One", other: "Others" },
      params.count,
    ),
    params,
  );
export let $account_$user$profile_pluralAsObjectWithExtraKeys = (
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise(
      locale === "it"
        ? { one: "Uno", other: "Molti", noPluralRelated: "Sì" }
        : { one: "One", other: "Others", noPluralRelated: "Yes" },
      params.count,
    ),
    params,
  );
export let $account_$user$profile_pluralAsObjectWithExtraKeys_noPluralRelated =
  (locale?: I18n.Locale) => (locale === "it" ? "Sì" : "Yes");
export let $account_$user$profile_pluralNoDefault = (
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise(
      locale === "it"
        ? { one: "Uno", other: "Un po'" }
        : { one: "One", other: "Some" },
      params.count,
    ),
    params,
  );
export let $account_$user$profile_title = (
  params: { varName: string | number },
  locale?: I18n.Locale,
) => tInterpolateParams("Title {{ varName }}", params);
export let $account_FormUserLanguages_empty = (locale?: I18n.Locale) => ({});
export let $account_FormUserLanguages_msg = (locale?: I18n.Locale) =>
  locale === "it" ? "Del testo" : "Some text";
export let $faq_home = (locale?: I18n.Locale) =>
  locale === "it"
    ? [{ question: "Cos'è?", answer: "Quello" }]
    : [{ question: "What is?", answer: "That" }];
