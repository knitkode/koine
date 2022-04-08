import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ProgressOverlay } from "@koine/react";

export type NextProgressProps = {
  /** @default 0.3 */
  startAt: number;
  /** @default true */
  showOnShallow: boolean;
  /** @default 200 */
  stopDelayMs: number;
};

export const NextProgress = ({
  startAt = 0.3,
  showOnShallow = true,
  stopDelayMs = 200,
}) => {
  const { events } = useRouter();
  // const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const routeChangeStart = useCallback(
    (_, { shallow }) => {
      if (!shallow || showOnShallow) {
        // setProgress(startAt);
        setRunning(true);
      }
    },
    [showOnShallow]
  );

  const routeChangeEnd = useCallback(
    (_, { shallow }) => {
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

  return <ProgressOverlay running={running} />;
};
