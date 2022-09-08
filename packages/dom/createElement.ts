import addClass from "./addClass";

/**
 * Shortcut for `document.createElement`, allowing to to create an HTML element
 * with a given className directly (a very common use case)
 *
 * @param type
 * @param className
 */
export function createElement(type: string, className?: string) {
  const el = document.createElement(type);
  if (className) {
    addClass(el, className);
  }
  return el;
}

export default createElement;
