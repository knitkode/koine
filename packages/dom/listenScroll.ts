import { debounce } from "@koine/utils";
import { on } from "./on";

/**
 * Listen window scroll event debouncing the given handler
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function listenScroll(...args: Parameters<typeof debounce>) {
  const handler = debounce(...args);
  const unbinder = on(window, "scroll", handler, {
    capture: true,
    passive: true,
  });

  return unbinder;
}

export default listenScroll;
