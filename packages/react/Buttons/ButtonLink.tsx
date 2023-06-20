import styled from "styled-components";
import { KoineLinkProps } from "../Link";
import { KoineComponent, KoineComponentProps } from "../types";
import { KoineButton, KoineButtonUiProps } from "./Button";

const Root = styled(KoineButton)`
  text-decoration: none;
`;

export type KoineButtonLinkProps = KoineButtonUiProps & KoineLinkProps;

export type ButtonLinkProps = KoineComponentProps<
  KoineButtonLinkProps,
  {
    Link?: KoineComponent;
  }
>;

export const KoineButtonLink = ({
  href,
  Link = "a",
  ...props
}: React.PropsWithChildren<ButtonLinkProps>) => {
  const isRelative = href && href.startsWith("/");

  return isRelative ? (
    <Root href={href} {...props} as={Link} />
  ) : (
    <Root href={href} {...props} as="a" />
  );
};
