import useTranslation from "next-translate/useTranslation";

export function useLocale() {
  return useTranslation().lang;
}
