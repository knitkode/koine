import type {
  AnyDOMEvent,
  AnyDOMEventType,
  AnyDOMEventTargetLoose,
} from "./types";

/**
 * Shortcut for `removeEventListener`
 */
export function off<TType extends AnyDOMEventType>(
  el: AnyDOMEventTargetLoose,
  type: TType,
  handler: (event: AnyDOMEvent<TType>) => void,
  options: EventListenerOptions | boolean = false
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      console.warn("[@koine/dom:off] unexisting DOM element");
    }
  }
  if (el) el.removeEventListener(type, handler as EventListener, options);
}

export default off;
