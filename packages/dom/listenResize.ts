import { debounce } from "@koine/utils";
import { on } from "./on";

/**
 * Listen window resize event debouncing the given handler
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function listenResize(...args: Parameters<typeof debounce>) {
  const handler = debounce(...args);
  const unbinder = on(window, "resize", handler);

  return unbinder;
}

export default listenResize;
