import { memo } from "react";
import styled from "styled-components";
import { IconBaseProps, IconType } from "react-icons/lib/esm/index.js";
import { KoineComponentProps, KoineComponent } from "../types.js";
import { KoineButtonProps } from "./Button.js";
import { ButtonLinkProps } from "./ButtonLink.js";

const Root = styled.span<ButtonCompositeStyledProps>`
  ${(p) =>
    p.$icon ? `display: flex;` : `display: inline-block; text-align: left;`}
  min-width: 0;

  & svg {
    font-size: 2em !important;
    margin: 0 0.33em 0 0 !important;
  }
`;

const ButtonCompositeIcon = styled.svg`
  float: left;
`;

const BesidesIcon = styled.span<ButtonCompositeStyledProps>`
  text-align: left;
  line-height: 1.2;
`;

const Main = styled.span<ButtonCompositeStyledProps>`
  display: block;
  font-size: 0.9em;

  &:last-child {
    margin-top: ${(p) => (p.$reverse && !p.$icon ? "0.5em" : "0")};
  }
`;

const Sub = styled.span<ButtonCompositeStyledProps>`
  display: block;
  text-transform: none;
  font-size: 0.7em;
  font-weight: 500;

  ${Main} + & {
    margin-top: ${(p) => (p.$reverse && !p.$icon ? "0.5em" : "0")};
  }
`;

const Text = styled.span``;

export type KoineButtonCompositeProps = KoineButtonProps &
  Omit<ButtonLinkProps, "Koine"> & {
    Icon?: IconType | React.ElementType;
    iconProps?: IconBaseProps;
    textMain?: string;
    textSub?: string;
    text?: string;
    textReverse?: boolean;
  };

export type ButtonCompositeStyledProps = {
  $twoLines?: boolean;
  $reverse?: boolean;
  $icon?: boolean;
};

const Inner = memo(
  ({
    textMain,
    textSub,
    text,
    $reverse,
    $icon,
  }: ButtonCompositeStyledProps &
    Pick<ButtonCompositeProps, "textMain" | "textSub" | "text">) => (
    <>
      {$reverse ? (
        <>
          {textSub && (
            <Sub $icon={$icon} $reverse={$reverse}>
              {textSub}
            </Sub>
          )}
          {textMain && (
            <Main $icon={$icon} $reverse={$reverse}>
              {textMain}
            </Main>
          )}
        </>
      ) : (
        <>
          {textMain && (
            <Main $icon={$icon} $reverse={$reverse}>
              {textMain}
            </Main>
          )}
          {textSub && (
            <Sub $icon={$icon} $reverse={$reverse}>
              {textSub}
            </Sub>
          )}
        </>
      )}
      {text && <Text>{text}</Text>}
    </>
  )
);

export type ButtonCompositeProps = KoineComponentProps<
  KoineButtonCompositeProps,
  {
    Button?: KoineComponent;
    ButtonLink?: KoineComponent;
  }
>;

export const KoineButtonComposite = ({
  Icon,
  iconProps = {},
  textMain,
  textSub,
  textReverse,
  text,
  Button = "button",
  ButtonLink = "a",
  ...props
}: ButtonCompositeProps) => {
  const Btn = props.href ? ButtonLink : Button;
  const styledProps = {
    $icon: !!Icon,
    $reverse: textReverse,
    $twoLines: !!(textMain && textSub && !Icon),
  };
  const innerProps = { textMain, textSub, text, ...styledProps };
  return (
    <Root as={Btn} {...props} {...styledProps}>
      {Icon && <ButtonCompositeIcon as={Icon} {...iconProps} />}
      {Icon ? (
        <BesidesIcon {...styledProps}>
          <Inner {...innerProps} />
        </BesidesIcon>
      ) : (
        <Inner {...innerProps} />
      )}
    </Root>
  );
};
