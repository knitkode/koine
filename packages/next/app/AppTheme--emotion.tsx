import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { ThemeProvider, Theme } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { Global, css } from "@emotion/react";
import { stylesGlobal } from "@koine/react/styles/Global";
import { createEmotionCache } from "../utils/emotion-cache";

// client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type AppThemeEmotionProps = React.PropsWithChildren<
  NextAppProps & {
    emotionCache?: EmotionCache;
    /**
     * A theme object
     */
    theme: Theme;
  }
>;

/**
 * App theme with `emotion` (good for `@mui`)s
 */
export const AppThemeEmotion: React.FC<AppThemeEmotionProps> = ({
  emotionCache = clientSideEmotionCache,
  theme,
  children,
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Global
          styles={css`
            ${stylesGlobal}
          `}
        />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
