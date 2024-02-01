/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Koine {
  interface Translations {
    "~": {
      about: string;
      account: {
        user: {
          profile: string;
          "[id]": string;
          settings: { index: string; personal: string };
        };
      };
      products: {
        index: string;
        "[id]": { index: string; edit: { index: string; details: string } };
      };
      apps: {
        tool: {
          index: string;
          "[spa]": string;
          things: {
            index: string;
            "[id]": {
              index: string;
              detail: {
                index: string;
                new: string;
                "[detailId]": { index: string; edit: string };
              };
            };
          };
        };
      };
    };
    $faq: { home: { question: string; answer: string }[] };
    "404": { seo: { title: string }; title: string };
    "~account/~user~profile": {
      boolShouldntBeHereBut: boolean;
      title: string;
      plural: string;
      pluralAsObject: string;
      pluralAsObjectWithExtraKeys: string | { noPluralRelated: string };
      listFlat: string[];
      listComplex: { k1: string; k2: string }[];
      obj: {
        objNested: {
          str: string;
          listFlatNested: string[];
          listComplexNested: { k1: string; k2: string }[];
          objNested2: {
            objNested21: { k: string };
            listFlatNested22: string[];
            str3: string;
          };
          objNested2b: {
            str2b1: string;
            str2b2: string;
            listFlatNested2b3: string[];
            str2b4: string;
          };
        };
      };
      pluralNoDefault: string;
    };
    "~account/FormUserLanguages": { empty: {}; msg: string };
  }
}
