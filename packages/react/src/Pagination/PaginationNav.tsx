import styled from "styled-components";
import { CgArrowRightR as IconArrowRight } from "@react-icons/all-files/cg/CgArrowRightR";
import { CgArrowLeftR as IconArrowLeft } from "@react-icons/all-files/cg/CgArrowLeftR";
import { ensureInt } from "@koine/utils";
import { KoineComponentProps, KoineComponent } from "../types";

const Root = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0 40px;
  font-weight: 600;

  & a {
    text-decoration: none;
  }
`;

const item = `
  display: block;
  padding: 5px 10px;
`;

const ItemCurrent = styled.span`
  ${item}
  background: var(--accent400);
  border-radius: 2px;
`;

const ItemLink = styled.a<{
  prev?: boolean;
  next?: boolean;
}>`
  ${item}

  ${(props) => (props.prev ? "color: var(--grey100);" : "")}
`;

const DotsSeparator = styled.span`
  color: var(--grey100);
`;

const arrow = `display: flex; font-size: 20px;`;

const ItemPrev = styled.a`
  ${arrow}
`;

const ItemNext = styled.a`
  ${arrow}
`;

export type KoinePaginationNavProps = {
  /** The total number of elements to paginate */
  total: string | number;
  /** The amount of items per page */
  perPage: string | number;
  /** The current page in the pagination */
  currentPage: string | number;
  /** Is the relative path of the url to prefix to the page number */
  baseUrl?: string;
  /**
   * The number of pages to show as number (and not dots) around the currentPage
   * @default 2
   */
  showOffset?: number;
};

type PaginationNavProps = KoineComponentProps<
  KoinePaginationNavProps,
  {
    currentUrl?: string;
    Link?: KoineComponent;
  }
>;

/*
 * Possible outcomes:
 * [1] 2 3 ... 78 >
 * < 1 2 [3] 4 5 ... 78 >
 * < 1 ... 6 7 [8] 9 10 ... 78 >
 * < 1 ... 75 76 [77] 78 >
 * < 1 ... 76 77 [78]
 */
export const KoinePaginationNav = ({
  total,
  perPage,
  currentPage,
  baseUrl,
  showOffset = 2,
  Koine = {
    Link: "a",
    currentUrl: "/",
  },
}: PaginationNavProps) => {
  const { Link, currentUrl } = Koine;
  total = ensureInt(total);
  currentPage = ensureInt(currentPage);
  perPage = ensureInt(perPage);
  // page 0 means 1
  currentPage = currentPage || 1;
  baseUrl = baseUrl || currentUrl;

  // don't output anything if pagination is not needed
  if (total < perPage) {
    return null;
  }

  const firstPage = 1;
  const lastPage = Math.ceil(total / perPage);
  const prevPage = currentPage - 1 > firstPage ? currentPage - 1 : "";
  const nextPage = currentPage + 1 < lastPage ? currentPage + 1 : lastPage;
  const prevArrow = currentPage > firstPage;
  const nextArrow = currentPage < lastPage;
  const pages: number[] = [];

  // fill the pages before the current
  for (let i = currentPage - showOffset; i < currentPage; i++) {
    if (i > 1) {
      pages.push(i);
    }
  }

  // add the current
  pages.push(currentPage);

  // fill the pages after the current
  for (let i = currentPage + 1; i < currentPage + 1 + showOffset; i++) {
    if (i < lastPage) {
      pages.push(i);
    }
  }

  const prevDots = pages[0] > firstPage + 1;
  const nextDots = pages[pages.length - 1] < lastPage - 1;

  return (
    <Root>
      {prevArrow && (
        <ItemPrev as={Link} href={`${baseUrl}/${prevPage}`}>
          <IconArrowLeft />
        </ItemPrev>
      )}
      {firstPage !== currentPage && (
        <ItemLink as={Link} href={`${baseUrl}`} prev={true}>
          {firstPage}
        </ItemLink>
      )}
      {prevDots && <DotsSeparator>...</DotsSeparator>}
      {pages.map((page) =>
        page === currentPage ? (
          <ItemCurrent key={page}>{page}</ItemCurrent>
        ) : (
          <ItemLink
            key={`pagination-${page}`}
            as={Link}
            href={`${baseUrl}/${page}`}
            prev={page < currentPage}
            next={page > currentPage}
          >
            {page}
          </ItemLink>
        )
      )}
      {nextDots && <DotsSeparator>...</DotsSeparator>}
      {lastPage !== currentPage && (
        <ItemLink as={Link} href={`${baseUrl}/${lastPage}`} next={true}>
          {lastPage}
        </ItemLink>
      )}
      {nextArrow && (
        <ItemNext as={Link} href={`${baseUrl}/${nextPage}`}>
          <IconArrowRight />
        </ItemNext>
      )}
    </Root>
  );
};
