/**
 * @file
 *
 * Maybe do a simplified version following this example:
 * https://codesandbox.io/s/framer-motion-accordion-qx958?file=/src/Example.tsx
 */
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MotionProps, m } from "framer-motion";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";
import { BsBoxArrowInDown as IconCollapse } from "@react-icons/all-files/bs/BsBoxArrowInDown";
// FIXME: ssr likely problem
import { uid } from "@koine/utils";
import { btnStyleReset } from "../Buttons";
import { useWindowSize } from "../hooks/useWindowSize";
import { InputInvisible } from "../Forms";

export type CollapsableStyledProps = {
  $expanded?: boolean;
};

export const CollapsableHeadRoot = styled(m.label).attrs(
  (props: Pick<CollapsableHeadProps, "id">) => ({
    htmlFor: `${props.id}-input`,
  })
)<Pick<CollapsableStyledProps, "$expanded">>`
  ${btnStyleReset}
  width: 100%;
  padding: 0;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const CollapsableHeadSpace = styled.div`
  flex: 1;
  padding-left: 20px;
`;

export const CollapsableHeadAction = styled.div`
  padding-left: 20px;
`;

export const CollaspableHeadLine = styled(m.div)`
  width: 0%;
  height: 1px;
  background: #bbb;
`;

export const collapsableHeadLineMotion = {
  hover: {
    width: "100%",
    transition: {
      duration: 0.4,
    },
  },
};

export const CollapsableHeadText = styled.div``;

export const CollapsableHeadIcon = styled(m.div)``;

export type CollapsableHeadProps = Pick<CollapsableStyledProps, "$expanded"> &
  CollapsableComponents & {
    id: CollapsableProps["id"];
    onClick: (...args: any) => any;
  };

export const CollapsableHead: React.FC<CollapsableHeadProps> = ({
  $expanded,
  id,
  onClick,
  HeadRoot = CollapsableHeadRoot,
  HeadAction = CollapsableHeadAction,
  HeadIcon = CollapsableHeadIcon,
  children,
}) => {
  return (
    <DisclosureButton
      onClick={onClick}
      // tabIndex={0}
      // role="tab"
      initial="rest"
      whileHover="hover"
      $expanded={$expanded}
      as={HeadRoot}
      id={id}
    >
      <CollapsableHeadText>{children}</CollapsableHeadText>
      <CollapsableHeadSpace>
        <CollaspableHeadLine
          variants={collapsableHeadLineMotion}
          animate={$expanded ? "hover" : ""}
        />
      </CollapsableHeadSpace>
      {HeadAction && (
        <HeadAction>
          {HeadIcon && (
            <HeadIcon animate={{ rotate: $expanded ? 180 : 0 }}>
              <IconCollapse />
            </HeadIcon>
          )}
        </HeadAction>
      )}
    </DisclosureButton>
  );
};

export const CollapsableInput = styled(InputInvisible).attrs({
  type: "checkbox",
})``;

export const CollasableBodyWrap = styled(
  DisclosurePanel
)<CollapsableStyledProps>`
  /* this is because @reach adds the "hidden" attribute */

  &[hidden] {
    display: block;
  }
`;

export const CollapsableBodyRoot = styled(m.div)`
  .no-js & {
    transition: margin-top 0.2s ease;
  }
  .no-js ${CollapsableInput}:checked + ${CollasableBodyWrap} & {
    margin-top: 0 !important;
    opacity: 1 !important;
  }
`;

export type CollapsableBodyProps = MotionProps &
  Pick<CollapsableStyledProps, "$expanded"> & {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  };

export const CollapsableBody = forwardRef<HTMLDivElement, CollapsableBodyProps>(
  function CollapsableBody(props, ref) {
    return <CollapsableBodyRoot ref={ref} {...props} />;
  }
);

export type CollapsableComponents = {
  HeadRoot?: typeof CollapsableHeadRoot;
  HeadAction?: null | typeof CollapsableHeadAction | React.FC<any>;
  HeadIcon?: null | typeof CollapsableHeadIcon | React.FC<any>;
};

export type CollapsableProps = React.ComponentPropsWithoutRef<"div"> & {
  id?: string;
  expanded?: boolean;
  /** Used to trigger a recalculation effect */
  recalc?: any;
  onChange?: () => any;
  head: null | React.ReactNode;
  body: React.ReactNode;
  /** Amount of milliseconds after which the component collapses */
  // autoCollapse?: number;
  components?: CollapsableComponents;
  /** @default "Expand" */
  ariaExpand?: string;
  /** @default "Collapse" */
  ariaCollapse?: string;
};

export const Collapsable = ({
  expanded: propExpanded,
  recalc,
  onChange,
  id,
  head,
  body,
  // autoCollapse,
  components = {},
  ariaExpand = "Expand",
  ariaCollapse = "Collapse",
  ...props
}: CollapsableProps) => {
  const isControlled = typeof propExpanded !== "undefined";
  const [stateExpanded, setStateExpanded] = useState(propExpanded);
  const [height, setHeight] = useState(0);
  const hash = id ? `#${id}` : "";
  const winSize = useWindowSize();
  const expanded = isControlled ? propExpanded : stateExpanded;
  const [overflow, setOverflow] = useState(expanded ? "unset" : "hidden");
  const content = useRef<HTMLDivElement>(null);
  // FIXME: ssr likely problem
  id = id || uid();

  const handleClick = useCallback(() => {
    if (hash) {
      window.history.replaceState(
        null,
        "",
        expanded ? window.location.pathname + window.location.search : hash
      );
    }

    if (onChange) {
      onChange();
    }

    if (!isControlled) {
      setStateExpanded((prevExpanded) => !prevExpanded);
    }
  }, [expanded, hash, onChange, isControlled]);

  const handleAnimationStart = useCallback(() => {
    setOverflow("hidden");
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setOverflow(expanded ? "unset" : "hidden");
  }, [expanded]);

  useEffect(() => {
    if (content.current) {
      setHeight(Math.ceil(content.current.offsetHeight));
    }
  }, [winSize, recalc]);

  // deeplink on mount
  useEffect(() => {
    if (!isControlled && hash && window.location.hash === hash) {
      setStateExpanded(true);
    }
  }, [hash, isControlled]);

  return (
    <Disclosure id={id} {...props} open={expanded || false}>
      {head !== null && (
        <CollapsableHead
          id={id}
          $expanded={expanded}
          onClick={handleClick}
          {...components}
        >
          {head}
        </CollapsableHead>
      )}
      <CollapsableInput id={`${id}-input`} />
      <CollasableBodyWrap $expanded={expanded} style={{ overflow }}>
        <CollapsableBody
          ref={content}
          $expanded={expanded}
          // aria-expanded={expanded}
          // aria-label={expanded ? ariaCollapse : ariaExpand}
          style={{
            pointerEvents: expanded ? "all" : "none",
          }}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          animate={{
            marginTop: expanded ? 0 : height ? `-${height}px` : "-100vh",
            opacity: expanded ? 1 : 0.4,
          }}
        >
          {body}
        </CollapsableBody>
      </CollasableBodyWrap>
    </Disclosure>
  );
};
