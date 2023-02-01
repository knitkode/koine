// import { noop } from "@koine/utils"; FIXME: build breaks with this import
import type { AnyDOMEventTargetLoose } from "./types";
import { off } from "./off";

/**
 * Shortcut for `addEventListener`
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function on<THandler extends (event: any) => void>(
  el: AnyDOMEventTargetLoose,
  type: string,
  handler: THandler /* EventListener |  */ /* ((event: Event) => void) */,
  options: AddEventListenerOptions | boolean = false
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      console.warn("[@koine/dom:on] unexisting DOM element");
    }
  }
  if (el) {
    el.addEventListener(type, handler, options);
    return () => off(el, type, handler);
  }

  // return noop;
  return () => void 0;
}

export default on;
