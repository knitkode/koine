// import noop from "@koine/utils/noop"; FIXME: build breaks with this import
import type {
  AnyDOMEventType,
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
} from "./types";
import off from "./off";

/**
 * Shortcut for `addEventListener`
 *
 * @returns An automatic unbinding function to run to deregister the listener upon call
 */
export function on<TType extends AnyDOMEventType>(
  el: AnyDOMEventTargetLoose,
  type: TType,
  handler: (event: AnyDOMEvent<TType>) => void,
  // handler: THandler /* EventListener |  */ /* ((event: Event) => void) */,
  options: AddEventListenerOptions | boolean = false
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      console.warn("[@koine/dom:on] unexisting DOM element");
    }
  }
  if (el) {
    el.addEventListener(type, handler as EventListener, options);
    return () => off(el, type, handler);
  }

  // return noop;
  return () => void 0;
}

export default on;
