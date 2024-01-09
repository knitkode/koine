"use client";

import { format } from "date-fns/format";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDateLocale } from "@koine/react";

type FormatType = typeof format;

/**
 * Automatically returns the `date-fns/format` function with the right locale
 * passed as option (grabbed from next router value).
 *
 * @deprecated
 */
export const useDateFormat = () => {
  const [formatter, setFormatter] = useState<FormatType>(
    () =>
      (...args: Parameters<FormatType>) =>
        format(...args),
  );
  const router = useRouter();
  const locale = useDateLocale(router.locale);

  useEffect(() => {
    if (locale) {
      const newFormatter = (
        date: Parameters<FormatType>[0],
        _format: Parameters<FormatType>[1],
        options: Parameters<FormatType>[2],
      ) => format(date, _format, { ...(options || {}), locale });
      setFormatter(
        () =>
          (...args: Parameters<FormatType>) =>
            newFormatter(...args),
      );
    }
  }, [locale]);

  return formatter;
};

export default useDateFormat;
