/**
 * For each, iterate through a NodeList of HTMLElements
 *
 * @param nodes DOM nodes collection
 * @param callback
 * @param scope
 */
export function forEach<T extends Element, TScope = object>(
  nodes: NodeListOf<T>,
  callback: (this: TScope, $element: T, index: number) => any,
  scope?: TScope
) {
  for (let i = 0; i < nodes.length; i++) {
    callback.call(scope as TScope, nodes[i] as T, i);
  }
}

export default forEach;
