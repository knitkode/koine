/**
 * @usage
 *
 * ```js
 * getFragment("/terms-of-use", "content");
 * ```
 */
export const getFragment = async (url: string, id: string) => {
  const res = await fetch(url);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const node = doc.getElementById(id);
  debugger;
  if (node) {
    return node.innerHTML;
  }
  return "";
};

export default getFragment;
