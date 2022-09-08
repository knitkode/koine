/**
 * Return the current style value for an element CSS property
 *
 * @param el The element to compute
 * @param prop The style property
 */
export function getStyleValue(el: HTMLElement, prop: string) {
  return getComputedStyle(el, null).getPropertyValue(prop);
}

export default getStyleValue;
