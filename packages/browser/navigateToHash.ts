/**
 * It updates the browser's location hash by replacing the history state.
 * The non-silent standard way would simply be `location.hash = "#new-hash"`
 *
 * @category location
 */
export function navigateToHash(hash = "") {
  const { pathname, search } = location;

  history.replaceState(
    null,
    "",
    pathname + (search ? "?" + search : "") + "#" + hash
  );
}

export default navigateToHash;
