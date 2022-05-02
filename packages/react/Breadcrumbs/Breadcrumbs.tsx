import styled, { css } from "styled-components";
import { m } from "framer-motion";
import { MdKeyboardArrowRight as IconDelimiter } from "react-icons/md";
import { titleCase } from "@koine/utils";
import { KoineComponentProps, KoineComponent } from "../types";
import { max, min } from "../styles/media";

const LINK_GUTTER_X = 10;

const Root = styled.nav`
  display: flex;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  font-size: 11px;
  color: var(--grey100);
  ${min.sm} {
    font-size: 12px;
  }
  ${max.lg} {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Item = styled(m.div)`
  display: flex;
  align-items: center;
  /* margin: 0 10px 0 0; */

  &:first-child {
    margin-left: -${LINK_GUTTER_X / 2}px;
  }
  ${min.sm} {
    &:first-child {
      margin-left: -${LINK_GUTTER_X}px;
    }
  }
`;

const itemChild = css`
  display: block;
  padding: 10px ${LINK_GUTTER_X / 2}px;

  ${min.sm} {
    padding: 10px ${LINK_GUTTER_X}px;
  }
`;

const ItemLink = styled.a`
  ${itemChild}
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ItemCurrent = styled.span`
  ${itemChild}
`;

const ItemSeparator = styled(IconDelimiter)``;

export type BreadcrumbsItem = {
  title: string;
  url?: string;
};

export type KoineBreadcrumbsProps = {
  items: BreadcrumbsItem[];
};

type BreadcrumbsProps = KoineComponentProps<
  KoineBreadcrumbsProps,
  {
    Link: KoineComponent;
  }
>;

export const KoineBreadcrumbs = ({
  items = [],
  Link,
  ...props
}: BreadcrumbsProps) => {
  if (!items.length) {
    return null;
  }
  return (
    <Root {...props}>
      <Inner>
        {items.map((item, idx) => (
          <Item
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: idx * 0.2 },
            }}
          >
            {item.url && (
              <ItemLink as={Link} href={item.url}>
                {titleCase(item.title)}
              </ItemLink>
            )}
            {!item.url && <ItemCurrent>{titleCase(item.title)}</ItemCurrent>}
            {idx < items.length - 1 && <ItemSeparator />}
          </Item>
        ))}
      </Inner>
    </Root>
  );
};
