import React, { forwardRef } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { KoineLink, KoineLinkProps } from "@koine/react";

export type LinkProps = Omit<KoineLinkProps, "href"> &
  Omit<NextLinkProps, "as" | "passHref" | "children">;

/**
 * @see https://next.js.org/docs/api-reference/next/link
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch, replace, scroll, shallow, locale, ...props },
  ref
) {
  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}
      passHref
    >
      <KoineLink ref={ref} {...props} />
    </NextLink>
  );
});
