import { debounce } from "@koine/utils";
import { on } from "./on";
import { off } from "./off";

/**
 * Listen window scroll event debouncing the given handler
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function listenScroll(...args: Parameters<typeof debounce>) {
  const handler = debounce(...args);

  on(window, "scroll", handler, {
    capture: true,
    passive: true,
  });

  /**
   * Unbind the previously attached scroll handler
   */
  function unbinder() {
    handler.cancel();
    off(window, "scroll", handler);
  }

  return unbinder;
}

export default listenScroll;
