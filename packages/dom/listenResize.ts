import { debounce } from "@koine/utils";
import { on } from "./on";
import { off } from "./off";

/**
 * Listen window resize event debouncing the given handler
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function listenResize(...args: Parameters<typeof debounce>) {
  const handler = debounce(...args);

  on(window, "resize", handler);

  /**
   * Unbind the previously attached scroll handler
   */
  function unbinder() {
    handler.cancel();
    off(window, "resize", handler);
  }

  return unbinder;
}

export default listenResize;
