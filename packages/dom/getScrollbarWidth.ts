/**
 * Get scrollbar's current width
 */
export function getScrollbarWidth(element?: HTMLElement) {
  return window.innerWidth - (element || document.documentElement).clientWidth;
}

export default getScrollbarWidth;
