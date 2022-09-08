/**
 * Checks if passed node exist and is a valid element.
 *
 * @borrows @glidejs/glide/src/utils/dom (source)
 */
export function exists(node?: Element) {
  if (node && node instanceof window.HTMLElement) {
    return true;
  }

  return false;
}

export default exists;
