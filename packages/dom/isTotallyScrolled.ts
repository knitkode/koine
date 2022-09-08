/**
 * Is element totally scrolled
 *
 * @see https://github.com/willmcpo/body-scroll-lock/blob/master/src/bodyScrollLock.js#L116
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
 */
export function isTotallyScrolled(el?: HTMLElement) {
  return el ? el.scrollHeight - el.scrollTop <= el.clientHeight : false;
}

export default isTotallyScrolled;
