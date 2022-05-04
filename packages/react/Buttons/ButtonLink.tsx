import styled from "styled-components";
import { KoineComponentProps, KoineComponent } from "../types.js";
import { KoineLinkProps } from "../Link/index.js";
import { KoineButton, KoineButtonUiProps } from "./Button.js";

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

// export const KoineButtonLink: FC<ButtonLinkProps> = ({ Koine, ...props }) => {
//   return <Root {...props} as={Koine.Link} />;
// }
export const KoineButtonLink: React.FC<ButtonLinkProps> = ({
  href,
  Link = "a",
  ...props
}) => {
  const isRelative = href && href.startsWith("/");

  return isRelative ? (
    <Root href={href} {...props} as={Link} />
  ) : (
    <Root href={href} {...props} as="a" />
  );
};
