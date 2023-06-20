"use client";

import { type Router, useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Simplify } from "@koine/utils";
import type { WithComponents } from "@koine/react/helpers";

// FIXME: workaround to re-create type that is not exported by next.js
type RouteProperties = Parameters<Router["getRouteInfo"]>[0]["routeProps"];

type OwnProps = {
  /** @default 0.3 */
  startAt?: number;
  /** @default true */
  showOnShallow?: boolean;
  /** @default 200 */
  stopDelayMs?: number;
  /** @default "div" */
};

export type Components = {
  Overlay: {
    type: "div";
    props: { running?: boolean }; // FIXME: grab these props from @koine/react/Progress once we have ported that to multiframework configuration
  };
};

export type ComponentsProps = {
  [Name in keyof Components]: Components[Name]["props"];
};

type Props = Simplify<WithComponents<OwnProps, Components>>;

export type NextProgressProps = Props;

export const NextProgress = ({
  startAt = 0.3,
  showOnShallow = true,
  stopDelayMs = 200,
  Overlay = "div",
}: NextProgressProps) => {
  const { events } = useRouter();
  // const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const routeChangeStart = useCallback(
    (_: any, { shallow }: RouteProperties) => {
      if (!shallow || showOnShallow) {
        // setProgress(startAt);
        setRunning(true);
      }
    },
    [showOnShallow]
  );

  const routeChangeEnd = useCallback(
    (_: any, { shallow }: RouteProperties) => {
      if (!shallow || showOnShallow) {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          // setProgress(100);
          setRunning(false);
        }, stopDelayMs);
      }
    },
    [showOnShallow, stopDelayMs, timer]
  );

  useEffect(() => {
    events.on("routeChangeStart", routeChangeStart);
    events.on("routeChangeComplete", routeChangeEnd);
    events.on("routeChangeError", routeChangeEnd);

    return () => {
      events.off("routeChangeStart", routeChangeStart);
      events.off("routeChangeComplete", routeChangeEnd);
      events.off("routeChangeError", routeChangeEnd);
    };
  }, [events, routeChangeStart, routeChangeEnd]);

  return <Overlay running={running} />;
};

export default NextProgress;
