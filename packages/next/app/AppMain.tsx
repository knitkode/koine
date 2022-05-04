import React from "react";
import type { AppProps as NextAppProps } from "next/app";
import type { HTMLMotionProps } from "framer-motion";
import type { SeoDefaultsProps } from "../Seo/index.js";
import type { NextProgressProps } from "../NextProgress/index.js";
import type { MotionProviderFeatures } from "@koine/react/m/index.js";

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

export type AppMainFramerProps = {
  motion: MotionProviderFeatures;
  /**
   * Default layout transition, by default it is a simple fade in/out
   */
  transition?: Omit<HTMLMotionProps<"div">, "key">;
};
