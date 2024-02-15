/**
 * Transform the route translated either into a `pathname` or a `template`.
 *
 * Here we add the wildcard flag maybe found in the pathname to the template
 * name too.
 *
 * @see https://nextjs.org/docs/messages/invalid-multi-match
 */
export function transformPathname(
  rawPathnameOrTemplate: string,
  wildcard?: boolean,
) {
  return (
    "/" +
    rawPathnameOrTemplate
      .split("/")
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("[[...")) {
          return `:${encodeURIComponent(part.slice(5, -2))}`;
        }
        if (part.startsWith("[[")) {
          return `:${encodeURIComponent(part.slice(2, -2))}`;
        }
        if (part.startsWith("[")) {
          return `:${encodeURIComponent(part.slice(1, -1))}`;
        }
        return `${encodeURIComponent(part)}`;
      })
      .join("/") +
    (wildcard ? "/:wildcard*" : "")
  );
}
