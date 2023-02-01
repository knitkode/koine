import { AnyDOMEventTargetLoose } from "./types";
import on from "./on";
import off from "./off";

/**
 * One shot listener, it `addEventListener` and removes it first time is called
 * with `removeEventListener`
 */
export function once(
  el: AnyDOMEventTargetLoose,
  type: string,
  handler: EventListener,
  options: EventListenerOptions | boolean = false
) {
  const handlerWrapper = (event: Event) => {
    handler(event);
    off(el, type, handlerWrapper);
  };

  return on(el, type, handlerWrapper, options);
}

export default once;
