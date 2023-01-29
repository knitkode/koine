import { useEffect, useState } from "react";
import type { Locale } from "date-fns";

/**
 * Dynamically import the date-fns correct locale
 *
 * Inspired by:
 * @see https://robertmarshall.dev/blog/dynamically-import-datefns-locale-mui-datepicker-localization/
 */
export function useDateLocale(locale?: string, defaultLocale = "en") {
  const [data, setData] = useState<Locale>();
  const [current, setCurrent] = useState(defaultLocale);
  // const [ready, setReady] = useState(false);

  // If the user changes the locale listen to the change and import the locale that is now required.
  useEffect(() => {
    const importLocaleFile = async () => {
      // This webpack option stops all of the date-fns files being imported and chunked.
      const localeToSet = await import(
        /* webpackMode: "lazy", webpackChunkName: "df-[index]", webpackExclude: /_lib/ */
        `date-fns/locale/${locale}/index.js`
      );
      setCurrent(locale || current);
      setData(localeToSet.default);
      // setReady(true);
    };

    // If the locale has not yet been loaded.
    if (locale !== current) {
      importLocaleFile();
    }
  }, [locale, current]);

  return data;
}

export default useDateLocale;
