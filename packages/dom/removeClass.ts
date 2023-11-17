/**
 * Remove class shortcut
 */
export function removeClass<T extends Element = HTMLElement>(
  el?: T,
  className = "",
) {
  if (process.env.NODE_ENV === "development") {
    if (!el) {
      ("[@koine/dom:removeClass] unexisting DOM element");
      return;
    }
  }
  if (el) el.classList.remove(className);
}

export default removeClass;
