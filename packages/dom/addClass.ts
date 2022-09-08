/**
 * Add class shortcut
 */
export function addClass<T extends Element = HTMLElement>(
  el?: T,
  className = ""
) {
  if (process.env["NODE_ENV"] !== "production") {
    if (!el) {
      console.warn("[@koine/dom:addClass] unexisting DOM element");
      return;
    }
  }
  if (el) el.classList.add(className);
}

export default addClass;
