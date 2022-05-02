import { Children } from "react";
import styled from "styled-components";
import { uid, SetRequired } from "@koine/utils";
import {
  Row,
  RowProps,
  Col,
  ColProps,
  GRID_GUTTER_DEFAULT as DF,
} from "../Grid";

export const CarouselCssRow = styled(Row)<SetRequired<RowProps, "$gutter">>`
  ${({ $gutter: cs, theme: { gutter } }) => `
    margin-left: -${cs === DF ? gutter[DF] : (gutter[DF] - gutter[cs]) * 2}px;
    margin-right: -${cs === DF ? gutter[DF] : (gutter[DF] - gutter[cs]) * 2}px;
    padding-left: ${cs === DF ? gutter[DF] : gutter[DF] - gutter[cs]}px;
    padding-right: ${cs === DF ? gutter[DF] : gutter[DF] - gutter[cs]}px;
  `}

  scroll-behavior: smooth;
  scroll-snap-type: x;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CarouselCssCol = styled(Col)<
  Pick<KoineCarouselCssProps, "$snap"> & {
    $width: KoineCarouselCssProps["width"];
  }
>`
  ${(p) => p.$width && `flex-basis: ${p.$width}px; min-width: ${p.$width}px;`}
  position: relative;
  scroll-snap-align: ${(p) => p.$snap};
`;

export type KoineCarouselCssProps = ColProps & {
  /**
   * Override the `<Row>` gutter, if not specified `$gutter` prop is used
   */
  $gutterRow?: RowProps["$gutter"];
  /**
   * Override the `<Col>` gutter, if not specified `$gutter` prop is used
   */
  $gutterCol?: ColProps["$gutter"];
  /**
   * If items are not passed solely children are used
   */
  items?: JSX.Element[];
  /**
   * @default undefined (in percentage)
   */
  $proportion?: number;
  /**
   * @default "start"
   */
  $snap?: React.CSSProperties["scrollSnapAlign"];
  /**
   * Carousel's slide width
   */
  width?: number;
};

export type CarouselCssProps = React.PropsWithChildren<KoineCarouselCssProps>;

/**
 * For programmatic usage an example here @see https://stackoverflow.com/a/65902068/9122820
 */
export const KoineCarouselCss: React.FC<CarouselCssProps> = ({
  items,
  $gutterRow,
  $gutterCol,
  $gutter = "quarter",
  $proportion,
  $snap = "center",
  width,
  children,
  ...colProps
}) => {
  const slides = children ? Children.toArray(children) : items;
  const id = uid();

  if (!slides) return null;

  return (
    <CarouselCssRow $noWrap $gutter={$gutterRow || $gutter}>
      {slides.map((_slide, idx) => (
        <CarouselCssCol
          key={`CarouselCssCol-${id}-${idx}`}
          {...colProps}
          $gutter={$gutterCol || $gutter}
          $width={width}
        >
          {slides[idx]}
        </CarouselCssCol>
      ))}
    </CarouselCssRow>
  );
};
