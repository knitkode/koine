import { createGenerator } from "../../compiler/createAdapter";

// TODO: maybe move this @koine/utils or to @koine/i18n/client?
export default createGenerator("js", (_arg) => {
  return {
    getI18nAlternatesFromDom: {
      name: "getI18nAlternatesFromDom",
      ext: "ts",
      index: true,
      content: () => /* js */ `
import { createElement, domEach } from "@koine/dom";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export function getI18nAlternatesFromDom(
  includeSearch?: boolean,
  includeHash?: boolean,
) {
  const alternates: I18n.Alternates = {};

  domEach("[rel='alternate'][hrefLang]", (el) => {
    const locale = el.getAttribute("hrefLang");
    const href = el.getAttribute("href");
    if (locale && href) {
      const a = createElement("a");
      a.href = href;
      let relativeUrl = a.pathname;
      if (includeSearch) relativeUrl += a.search;
      if (includeHash) relativeUrl += a.hash;
      alternates[locale === "x-default" ? defaultLocale : locale] = relativeUrl;
    }
  });

  return alternates;
}

export default getI18nAlternatesFromDom;
`,
    },
  };
});
