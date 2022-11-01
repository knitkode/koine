/**
 * It updates the browser's location URL with global `history` object
 *
 * @category location
 */
export function navigateToUrl(url = "", replace?: boolean) {
  if (url) {
    history[replace ? "replaceState" : "pushState"](null, "", url);
  }
}

export default navigateToUrl;
