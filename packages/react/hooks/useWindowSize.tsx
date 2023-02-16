import { useEffect, useState } from "react";
import debounce from "@koine/utils/debounce";
import listenResize from "@koine/dom/listenResize";
import listenResizeDebounced from "@koine/dom/listenResizeDebounced";

/**
 * # Use `window` size
 *
 * @param args Optionally pass {@link debounce} arguments (`wait` and `immediate`)
 *
 * @returns An array with:
 * 1) _width_: using `window.innerWidth`
 * 2) _height_: using `window.innerHeight`
 */
export function useWindowSize(
  wait?: Parameters<typeof debounce>[1],
  immediate?: Parameters<typeof debounce>[2]
) {
  const [width, widthSet] = useState(0);
  const [height, heightSet] = useState(0);

  useEffect(() => {
    function updateSize() {
      widthSet(window.innerWidth);
      heightSet(window.innerHeight);
    }
    const listener = wait
      ? listenResizeDebounced(0, updateSize, wait, immediate)
      : listenResize(updateSize);
    updateSize();
    return listener;
  }, [wait, immediate]);

  return [width, height] as const;
}

export default useWindowSize;
