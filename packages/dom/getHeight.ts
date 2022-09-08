/**
 * Get element height
 */
export function getHeight(element: HTMLElement) {
  return parseInt(window.getComputedStyle(element).height, 10);
}

export default getHeight;
