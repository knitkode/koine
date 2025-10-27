import { createElement, domEach } from "@koine/dom";
import type { I18nUtils } from "./types";

export function i18nGetAlternatesInBrowser(
  includeSearch?: boolean,
  includeHash?: boolean,
) {
  const alternates: I18nUtils.Alternates = {};

  domEach("[rel='alternate'][hrefLang]", (el) => {
    const locale = el.getAttribute("hrefLang");
    const href = el.getAttribute("href");
    if (locale && href) {
      const a = createElement("a");
      a.href = href;
      let relativeUrl = a.pathname;
      if (includeSearch) relativeUrl += a.search;
      if (includeHash) relativeUrl += a.hash;
      alternates[locale] = relativeUrl;
    }
  });

  return alternates;
}

export default i18nGetAlternatesInBrowser;
