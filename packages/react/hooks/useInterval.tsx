import { useEffect, useRef } from "react";
import { noop } from "@koine/utils";

/**
 * @borrows [dan abramov](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
 *
 * We just add `deps` array argument and typescript support
 */
export function useInterval<T extends () => unknown>(
  callback: T,
  delay: number,
  deps: unknown[] = []
) {
  const savedCallback = useRef<T>();

  useEffect(() => {
    savedCallback.current = callback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return noop;
  }, [delay]);
}

export default useInterval;
