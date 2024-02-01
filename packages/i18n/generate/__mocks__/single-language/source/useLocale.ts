import { useRouter } from "next/router";
import type { I18n } from "./types";

export const useLocale = () => (useRouter().locale as I18n.Locale) || "en";

export default useLocale;
