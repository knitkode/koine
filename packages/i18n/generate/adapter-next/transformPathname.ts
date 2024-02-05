import type { I18nGenerate } from "../types";

/**
 * Transform the route translated defintion into a `pathname` and a `template`.
 *
 * Here we add the wildcard flag maybe found in the pathname to the template
 * name too.
 *
 * @see https://nextjs.org/docs/messages/invalid-multi-match
 */
export function transformPathname(
  route: I18nGenerate.DataRoute,
  rawPathnameOrTemplate: string,
) {
  return (
    "/" +
    rawPathnameOrTemplate
      .split("/")
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("[")) {
          return `:${encodeURIComponent(part.slice(1, -1))}`;
        }
        return `${encodeURIComponent(part)}`;
      })
      .join("/") +
    (route.wildcard ? "/:wildcard*" : "")
  );
}
