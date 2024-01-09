/**
 * Auto-generated on 2024-01-09T14:26:52.658Z
 */
declare namespace Koine {
  interface Translations {
    "~": {
      account: {
        user: {
          profile: string;
          public: string;
          settings: { index: string; personal: string };
        };
      };
    };
    "404": { seo: { title: string }; title: string };
    $faq: { home: { question: string; answer: string }[] };
    "~account/~user~profile": {
      boolShouldntBeHereBut: boolean;
      title: string;
      plural: string;
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
    };
    "~account/FormUserLanguages": { empty: {}; msg: string };
  }
}
