import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React, { forwardRef } from "react";

export type LinkProps = Omit<React.ComponentPropsWithRef<"a">, "href"> &
  Omit<NextLinkProps, "as" | "passHref" | "children"> & {
    Link?: React.ComponentType<any>;
  };

/**
 * @see https://next.js.org/docs/api-reference/next/link
 * @deprecated
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch, replace, scroll, shallow, locale, Link = "span", ...props },
  ref,
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
      <Link ref={ref} {...props} />
    </NextLink>
  );
});

export default Link;
