import type { I18nCompiler } from "../../compiler/types";

// TODO: maybe move this @koine/utils or to @koine/i18n/client?
export default ({}: I18nCompiler.AdapterArg<"js">) => `
import { createElement, domEach } from "@koine/dom";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

export function getAlternatesFromDom(
  includeSearch?: boolean,
  includeHash?: boolean,
) {
  const urls: I18n.Alternates = {};

  domEach("[rel='alternate'][hrefLang]", (el) => {
    const locale = el.getAttribute("hrefLang");
    const href = el.getAttribute("href");
    if (locale && href) {
      const a = createElement("a");
      a.href = href;
      let relativeUrl = a.pathname;
      if (includeSearch) relativeUrl += a.search;
      if (includeHash) relativeUrl += a.hash;
      urls[locale === "x-default" ? defaultLocale : locale] = relativeUrl;
    }
  });

  return urls;
}

export default getAlternatesFromDom;
`;
