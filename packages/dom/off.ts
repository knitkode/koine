import type { AnyDOMEventTargetLoose } from "./types";

/**
 * Shortcut for `removeEventListener`
 */
export function off(
  el: AnyDOMEventTargetLoose,
  type: string,
  handler: EventListener,
  options: EventListenerOptions | boolean = false
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      console.warn("[@koine/dom:off] unexisting DOM element");
    }
  }
  if (el) el.removeEventListener(type, handler, options);
}

export default off;
