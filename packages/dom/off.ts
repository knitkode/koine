/**
 * Shortcut for `removeEventListener`
 */
export function off(
  el: Window | Document | HTMLElement | Element,
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
