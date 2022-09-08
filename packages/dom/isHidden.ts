/**
 * Is element hidden?
 */
export function isHidden(el?: HTMLElement) {
  return !el || el.offsetParent === null;
}

export default isHidden;
