import React from "react";
import { AppProps as NextAppProps } from "next/app";
import { HTMLMotionProps } from "framer-motion";
import { SeoDefaultsProps } from "../Seo";
import { NextProgressProps } from "../NextProgress";

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
   * It defaults to fade in/out
   */
  transition?: Omit<HTMLMotionProps<"div">, "key">;
  /**
   * JSX to render just after SEO
   */
  pre?: React.ReactNode;
  /**
   * JSX to render just at the end of the markup
   */
  post?: React.ReactNode;
};
