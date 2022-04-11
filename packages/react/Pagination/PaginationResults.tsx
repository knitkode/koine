import styled from "styled-components";
import { AnimatePresence, m } from "framer-motion";

const Root = styled.div`
  // overflow: hidden;
`;

const Inner = styled(m.div)``;

export type PaginationResultsProps = unknown;

export const PaginationResults: React.FC<PaginationResultsProps> = ({
  children,
}) => {
  return (
    <AnimatePresence exitBeforeEnter initial={true}>
      <Root>
        <Inner
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "linear", staggerChildren: 0.3 }}
        >
          {children}
        </Inner>
      </Root>
    </AnimatePresence>
  );
};