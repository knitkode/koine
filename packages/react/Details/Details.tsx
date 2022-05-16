import {
  forwardRef,
  useCallback,
  useEffect,
  /* useId, */ useRef,
  useState,
} from "react";
import { type MotionProps } from "framer-motion";
import { useWindowSize } from "../hooks/useWindowSize";
import {
  extendComponent,
  // type OverridableComponents,
  type WithComponents,
  type Simplify,
} from "../helpers";
import { useId } from "../hooks/useId";

export type OwnProps = React.ComponentProps<"details"> & {
  open?: boolean;
  onChange?: () => any;
  summary: null | React.ReactNode;
  /** Amount of milliseconds after which the component collapses */
  // autoCollapse?: number;
  /** @default "Expand" */
  ariaExpand?: string;
  /** @default "Collapse" */
  ariaCollapse?: string;
  id?: string;
  /** Used to trigger a recalculation effect */
  recalc?: any;
};

export type Components = {
  Root: {
    type: "details";
    props: React.PropsWithChildren<{}>;
  };
  Summary: {
    type: "summary";
    props: React.PropsWithChildren<
      {
        $open: OwnProps["open"];
      } & Pick<OwnProps, "onChange">
    >;
  };
  Body: {
    type: "div";
    props: React.PropsWithChildren<
      {
        $open: OwnProps["open"];
      } & Pick<OwnProps, "onChange">
    >;
    motionable: true;
  };
  Content: {
    type: "div";
    props: React.PropsWithChildren<
      {
        $open: OwnProps["open"];
        "aria-expanded"?: React.AriaAttributes["aria-expanded"];
        "aria-label"?: React.AriaAttributes["aria-label"];
      } & Pick<OwnProps, "onChange">
    >;
    motionable: true;
  };
};

export type ComponentsProps = {
  [Name in keyof Components]: Components[Name]["props"];
};

export type Props = Simplify<WithComponents<OwnProps, Components>>;

export type DetailsProps = Props;

export type KoineDetailsProps = Props;

export const Root = "details" as unknown as Props["Root"];
export const Summary = "summary" as unknown as Props["Summary"];
export const Body = "div" as unknown as Props["Body"];
export const Content = "div" as unknown as Props["Content"];

/**
 * FIXME: it actually works even without forwardRef, check if we do need it
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
 */
const DetailsWithRef = forwardRef<HTMLDivElement, KoineDetailsProps>(
  function Details(
    {
      id,
      open: propOpen,
      recalc,
      summary,
      children,
      Root: _Root,
      Summary: _Summary,
      Body: _Body,
      Content: _Content,
      onChange,
      ...props
    },
    ref
  ) {
    const isControlled = typeof propOpen !== "undefined";
    const [stateOpen, setStateOpen] = useState(propOpen);
    const [height, setHeight] = useState(0);
    const hash = id ? `#${id}` : "";
    const winSize = useWindowSize();
    const open = isControlled ? propOpen : stateOpen;
    const [overflow, setOverflow] = useState(open ? "unset" : "hidden");
    const content = useRef<HTMLDivElement>(null);
    const defaultId = useId();
    id = id || defaultId;

    const handleClick = useCallback(() => {
      if (hash) {
        window.history.replaceState(
          null,
          "",
          open ? window.location.pathname + window.location.search : hash
        );
      }

      if (onChange) {
        onChange();
      }

      if (!isControlled) {
        setStateOpen((prevOpen) => !prevOpen);
      }
    }, [open, hash, onChange, isControlled]);

    useEffect(() => {
      if (content.current) {
        setHeight(Math.ceil(content.current.offsetHeight));
      }
    }, [winSize, recalc]);

    // deeplink on mount
    useEffect(() => {
      if (!isControlled && hash && window.location.hash === hash) {
        setStateOpen(true);
      }
    }, [hash, isControlled]);

    return (
      <Root {...props} open={open || false}>
        {/* list-style-type: none; */}
        <Summary $open={open} onClick={handleClick}>
          {summary || " "}
        </Summary>
        <Body $open={open} style={{ overflow }}>
          <Content
            // ref={content}
            $open={open}
            // aria-expanded={open}
            // aria-label={open ? ariaCollapse : ariaExpand}
            style={{
              pointerEvents: open ? "all" : "none",
            }}
          >
            {children}
          </Content>
        </Body>
      </Root>
    );
  }
);

export const KoineDetails = extendComponent(DetailsWithRef, {
  Root,
  Summary,
  Body,
  Content,
});

// export default Details;
