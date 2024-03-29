/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable prefer-const */
import { tInterpolateParams } from "./tInterpolateParams";
import { tPluralise } from "./tPluralise";
import type { I18n } from "./types";

export let $404_seo = (locale?: I18n.Locale) => ({ title: "404 - Not found" });
export let $404_seo_title = (locale?: I18n.Locale) => "404 - Not found";
export let $404_title = (locale?: I18n.Locale) => "404, page not found";
export let $account_$user$profile_boolShouldntBeHereBut = (
  locale?: I18n.Locale,
) => true;
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther = (
  locale?: I18n.Locale,
) => ({ "1": "One", "2": "Two", "3": "Three" });
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$1 = (
  locale?: I18n.Locale,
) => "One";
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$2 = (
  locale?: I18n.Locale,
) => "Two";
export let $account_$user$profile_dontConsiderMeAPluralIDontHaveOther_$3 = (
  locale?: I18n.Locale,
) => "Three";
export let $account_$user$profile_listComplex = (locale?: I18n.Locale) => [
  { k1: "v1", k2: "v2" },
];
export let $account_$user$profile_listFlat = (locale?: I18n.Locale) => [
  "v1",
  "v2",
];
export let $account_$user$profile_obj = (locale?: I18n.Locale) => ({
  objNested: {
    str: "v",
    listFlatNested: ["v1", "v2"],
    listComplexNested: [
      { k1: "v1 {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" },
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
});
export let $account_$user$profile_obj_objNested = (locale?: I18n.Locale) => ({
  str: "v",
  listFlatNested: ["v1", "v2"],
  listComplexNested: [
    { k1: "v1 {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" },
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
});
export let $account_$user$profile_obj_objNested_listComplexNested = (
  locale?: I18n.Locale,
) => [{ k1: "v1 {{ nestedVarName1 }}", k2: "v2 {{ nestedVarName2 }}" }];
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
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise({ one: "One", other: "Some", zero: "Zero" }, params.count),
    params,
  );
export let $account_$user$profile_pluralAsObject = (
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise({ one: "One", other: "Others" }, params.count),
    params,
  );
export let $account_$user$profile_pluralAsObjectWithExtraKeys = (
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise(
      { one: "One", other: "Others", noPluralRelated: "Yes" },
      params.count,
    ),
    params,
  );
export let $account_$user$profile_pluralAsObjectWithExtraKeys_noPluralRelated =
  (locale?: I18n.Locale) => "Yes";
export let $account_$user$profile_pluralNoDefault = (
  params: { count: number },
  locale?: I18n.Locale,
) =>
  tInterpolateParams(
    tPluralise({ one: "One", other: "Some" }, params.count),
    params,
  );
export let $account_$user$profile_title = (
  params: { varName: string | number },
  locale?: I18n.Locale,
) => tInterpolateParams("Title {{ varName }}", params);
export let $account_FormUserLanguages_empty = (locale?: I18n.Locale) => ({});
export let $account_FormUserLanguages_msg = (locale?: I18n.Locale) =>
  "Some text";
export let $faq_home = (locale?: I18n.Locale) => [
  { question: "What is?", answer: "That" },
];
