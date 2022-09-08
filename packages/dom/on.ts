/**
 * Shortcut for `addEventListener`
 */
export function on(
  el: Window | Document | HTMLElement | Element,
  type: string,
  handler: EventListener,
  options: AddEventListenerOptions | boolean = false
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      console.warn("[@koine/dom:on] unexisting DOM element");
      return;
    }
  }
  if (el) el.addEventListener(type, handler, options);
}

export default on;
