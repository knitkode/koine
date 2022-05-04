import styled from "styled-components";
import { Container, ContainerProps } from "../Grid/index.js";
import { Hidden } from "../Hidden/index.js";

const BgPhotoWrap = styled(Hidden)`
  z-index: -10;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  background-repeat: no-repeat;
  background-position: top left;
  background-size: contain;
  filter: hue-rotate(-36deg);
  opacity: 0.8;
`;

const BgPhotoMask = styled(Container)<BgPhotoPropsStyled>`
  position: relative;
  min-height: 100%;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    right: calc(100% - ${(p) => p.$overlap + 2}px);
    width: ${(p) => {
      const containerSizePx = p.theme.breakpoints[p.containerSize];
      return `calc(((100vw - ${containerSizePx}px) / 2) + ${p.$overlap + 2}px)`;
    }};
    background: linear-gradient(
        90deg,
        rgba(var(--bodyBg-rgb, 0)) 0%,
        rgba(var(--bodyBg-rgb, 1)) 100%
      ),
      linear-gradient(
        60deg,
        rgba(var(--bodyBg-rgb, 0)) 0%,
        rgba(var(--bodyBg-rgb, 1)) 70%
      );
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    left: ${(p) => p.$overlap + 1}px;
    width: 100vw;
    background: var(--bodyBg);
  }
`;

export type BgPhotoPropsStyled = Required<
  Pick<BgPhotoProps, "containerSize" | "$overlap">
>;

export type BgPhotoProps = {
  src: string;
  containerSize?: ContainerProps["size"];
  /**
   * Bg photo overlap on container, in px
   *
   * @default 0
   */
  $overlap?: number;
};

export const BgPhoto = ({
  src,
  containerSize = "xl",
  $overlap = 0,
}: BgPhotoProps) => {
  const styledProps = { containerSize, $overlap };
  return (
    <BgPhotoWrap style={{ backgroundImage: `url(${src})` }} $max="xxl">
      <BgPhotoMask size={containerSize} {...styledProps} />
    </BgPhotoWrap>
  );
};
