import { createContext, useEffect, useState } from "react";
import isBrowser from "@koine/utils/isBrowser";
// import setCookie from "@koine/utils/setCookie";
// import parseCookie from "@koine/utils/parseCookie";
import useUpdateEffect from "../hooks/useUpdateEffect";

export const THEME_KEY = "theme";

export const THEME_DEFAULT: ThemeVanillaValue = "light";

// export const getInitialThemeFromRequest = (
//   cookie?: string
// ): ThemeVanillaValue => {
//   if (cookie) {
//     const parsed = parseCookie<ThemeCookie>(cookie);
//     return parsed?.theme;
//   }
//   return THEME_DEFAULT;
// };

export const getInitialThemeFromClient = (): ThemeVanillaValue => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem(THEME_KEY);
    if (typeof storedPrefs === "string") {
      return storedPrefs as ThemeVanillaValue;
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches) {
      return "dark";
    }
  }

  return THEME_DEFAULT;
};

export type ThemeCookie = {
  [THEME_KEY]: ThemeVanillaValue;
};

export type ThemeVanillaValue = "light" | "dark";

export type ThemeVanillaContextType = {
  theme: ThemeVanillaValue;
  setTheme?: React.Dispatch<React.SetStateAction<ThemeVanillaValue>>;
};

export const ThemeVanillaContext = createContext({
  theme: "light",
  setTheme: undefined,
} as ThemeVanillaContextType);

export type ThemeVanillaProviderProps = React.PropsWithChildren<{
  initialTheme: ThemeVanillaValue;
}>;

export const ThemeVanillaProvider = ({
  initialTheme,
  children,
}: ThemeVanillaProviderProps) => {
  const [theme, setTheme] = useState(initialTheme);

  const rawSetTheme = (rawTheme: ThemeVanillaValue) => {
    if (!rawTheme || !isBrowser) {
      return;
    }
    const root = window.document.documentElement;
    const isDark = rawTheme === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(rawTheme);

    localStorage.setItem(THEME_KEY, rawTheme);
    // setCookie(THEME_KEY, rawTheme);
  };

  useEffect(() => {
    const theme = getInitialThemeFromClient();
    setTheme(theme);
    rawSetTheme(theme);
  }, []);

  useUpdateEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeVanillaContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeVanillaContext.Provider>
  );
};
