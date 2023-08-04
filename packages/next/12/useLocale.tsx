"use client";

import useTranslation from "next-translate/useTranslation";

/**
 * @deprecated
 */
export function useLocale() {
  return useTranslation().lang;
}

export default useLocale;
