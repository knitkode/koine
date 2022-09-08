/**
 * Finds siblings nodes of the passed node.
 *
 * @borrows @glidejs/glide/src/utils/dom (source)
 */
export function siblings(node: Element) {
  if (node && node.parentNode) {
    let n = node.parentNode.firstChild;
    const matched = [] as Element[];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== node) {
        matched.push(n as Element);
      }
    }

    return matched;
  }

  return [];
}

export default siblings;
