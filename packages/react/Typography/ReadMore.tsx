import React, { useState, useRef, useMemo } from "react";
import styled from "styled-components";
import { useIsomorphicLayoutEffect } from "react-use";
import { m, useSpring } from "framer-motion";
// import { CgArrowsExpandDownRight as IconExpand } from "react-icons/cg";

const Root = styled.div``;

const Content = styled.div`
  & p:first-child {
    margin-top: 0;
  }
`;

const BtnWrap = styled.span<ReadMoreStyledProps>`
  display: flex;
  justify-content: flex-end;
  transition: transform 0.18s ease-in-out;
  text-align: right;
  transform: translateY(${(p) => (p.$expanded ? "0" : "-100%")});
  opacity: ${(p) => (p.$expanded ? 0 : 1)};
`;

const BtnFader = styled.div<{ $bg: ReadMoreProps["bg"] }>`
  width: 30%;
  transition: transform 0.18s ease-in-out;
  background: linear-gradient(45deg, transparent 50%, ${(p) => p.$bg} 70%);
`;

const Btn = styled.span<ReadMoreStyledProps>`
  padding: 0 10px 0 10px;
  line-height: ${(p) => (p.$lineHeight ? p.$lineHeight : "inherit")};
  background: var(--bodyBg);
  color: var(--grey600);
  white-space: nowrap;
  font-size: ${(p) => p.$fontSize}px;
  cursor: pointer;
`;

const BtnIcon = styled.span<ReadMoreStyledProps>`
  display: inline-block;
  margin: 0 0 0 4px;
  transition: transform 0.18s ease-in-out;
  ${(p) => (p.$expanded ? "transform: rotate(180deg);" : "")};
  font-size: ${(p) => p.$fontSize}px;
`;

type ReadMoreStyledProps = {
  $expanded?: boolean;
  $fontSize?: number;
  $lineHeight?: number;
};

export type ReadMoreProps = React.ComponentPropsWithoutRef<"div"> & {
  lines?: number;
  lineHeight?: number;
  fontSize?: number;
  bg?: React.CSSProperties["background"];
  /** @default "Expand" */
  expand?: string;
  /** @default "Collapse" */
  collapse?: string;
};

export const ReadMore = ({
  lines = 3,
  lineHeight = 1.6,
  fontSize = 14,
  bg = "var(--bodyBg)",
  expand = "Expand",
  collapse = "Collapse",
  ...props
}: ReadMoreProps) => {
  const defaultMaxHeight = lines * (lineHeight * fontSize);
  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(defaultMaxHeight);
  const [fullHeight, setFullHeight] = useState(0);
  const [exceeds, setExceeds] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const height = useSpring(defaultMaxHeight);
  const styles = useMemo(
    () => (exceeds ? { height, overflow: "hidden" } : {}),
    [exceeds, height]
  );
  const handleExpandClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  useIsomorphicLayoutEffect(() => {
    if (content.current) {
      const elementHeight = content.current.offsetHeight;
      const newExceeds = elementHeight > maxHeight;

      if (!newExceeds) {
        setMaxHeight(elementHeight);
      }
      setExceeds(newExceeds);
      setFullHeight(elementHeight);
    }
  }, [content, maxHeight]);

  useIsomorphicLayoutEffect(() => {
    height.set(expanded ? fullHeight : maxHeight);
  }, [expanded, height, fullHeight, maxHeight]);

  return (
    <Root>
      <m.div style={styles}>
        <Content ref={content} {...props} />
      </m.div>
      {exceeds && (
        <BtnWrap $expanded={expanded}>
          <BtnFader $bg={bg} />
          <Btn
            $fontSize={fontSize}
            $lineHeight={lineHeight}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label={expanded ? collapse : expand}
          >
            {expanded ? collapse : expand}
            <BtnIcon $expanded={expanded}>{/* <IconExpand /> */}</BtnIcon>
          </Btn>
        </BtnWrap>
      )}
    </Root>
  );
};
