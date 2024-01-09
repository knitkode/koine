import type { AppProps as NextAppProps } from "next/app";
import React from "react";
import type { NextProgressProps } from "../NextProgress";
import type { SeoDefaultsProps } from "../SeoDefaults";

export type AppMainBaseProps = NextAppProps & {
  /**
   * A wrapping layout component
   */
  Layout: React.FC<Record<string, unknown>>;
  /**
   * A Progress' Overlay component
   */
  ProgressOverlay?: NextProgressProps["Overlay"];
  /**
   * Seo site wide default configuration
   */
  seo?: SeoDefaultsProps;
  /**
   * JSX to render just after SEO
   */
  pre?: React.ReactNode;
  /**
   * JSX to render just at the end of the markup
   */
  post?: React.ReactNode;
};
