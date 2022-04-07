import type { FC, ComponentPropsWithRef } from "react";
import styled from "styled-components";
import { MdLaunch as IconOutboundLink } from "@react-icons/all-files/md/MdLaunch";
import { max } from "../styles/media";

export type LinkBlankProps = ComponentPropsWithRef<"a">;

export const LinkBlankA = styled.a.attrs({
  target: "_blank",
  rel: "noopener",
})``;

// TODO: use `touch` class on <html> instead of relying on screenwidth,
// probably implement a lean Modernizr like thing with react-helmet
export const LinkBlankIcon = styled(IconOutboundLink)`
  color: var(---grey100);
  font-size: inherit;
  margin-left: 3px;
  line-height: inherit;
  vertical-align: middle;
  width: 0px;
  transition: width 0.1s ease-in-out;
  ${max.sm} {
    width: 20px;
    opacity: 0.8;
  }
`;

export const LinkBlank: FC<LinkBlankProps> = ({
  children,
  target,
  rel,
  ...props
}) => {
  return (
    <LinkBlankA {...props}>
      {children}
      <LinkBlankIcon />
    </LinkBlankA>
  );
};
