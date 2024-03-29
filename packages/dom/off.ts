import type {
  AnyDOMEvent,
  AnyDOMEventTargetLoose,
  AnyDOMEventType,
} from "./types";

/**
 * Shortcut for `removeEventListener`
 */
export let off = <TType extends AnyDOMEventType>(
  el: AnyDOMEventTargetLoose,
  type: TType,
  handler: (event: AnyDOMEvent<TType>) => void,
  options: EventListenerOptions | boolean = false,
) => {
  if (process.env["NODE_ENV"] === "development") {
    if (!el) {
      console.warn("[@koine/dom:off] unexisting DOM element");
    }
  }
  if (el) el.removeEventListener(type, handler as EventListener, options);
};

export default off;
