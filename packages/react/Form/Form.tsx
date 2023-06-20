import { useEffect, useState } from "react";
import type { Simplify } from "@koine/utils";
// import type { MotionProps } from "framer-motion";
import {
  // type OverridableComponents,
  type WithComponents,
  extendComponent,
} from "../helpers";

export type OwnProps = React.PropsWithChildren<{
  action: string;
  ok?: boolean;
  okProps?: object;
  fail?: boolean;
  failProps?: object;
  loading?: boolean;
  /** Whether the form should collapse on `ok` */
  collapseOnOk?: boolean;
  /** Whether the form should collapse on `fail` */
  collapseOnFail?: boolean;
  /**
   * Determines the time (in ms) that the `Ok` component wait before collapsing
   * When <= 0 the `Ok` component will persist
   *
   * @default 3000 */
  okTimeout?: number;
  /**
   * Determines the time (in ms) that the `Fail` component wait before collapsing
   * When <= 0 the `Fail` component will persist
   *
   * @default 3000 */
  failTimeout?: number;
}>;

export type Components = {
  Root: {
    type: "form";
    props: {};
    // motionable: true;
  };
  Overlay: {
    type: "div";
    props: {};
    // motionable: true;
  };
  Progress: {
    type: "div";
    props: {};
    // motionable: true;
  };
  Collapsable: {
    type: "div";
    props: {
      $open?: boolean;
      recalc?: boolean;
      body?: React.ReactNode;
    };
    // motionable: true;
  };
  Ok: {
    type: "div";
    props: React.PropsWithChildren<{}>;
    // motionable: true;
  };
  Fail: {
    type: "div";
    props: React.PropsWithChildren<{}>;
    // motionable: true;
  };
};

export type ComponentsProps = {
  [Name in keyof Components]: Components[Name]["props"];
};

export type Props = Simplify<WithComponents<OwnProps, Components>>;

export type FormProps = Props;

export type KoineFormProps = Props;

export const Root = "form" as unknown as Props["Root"];
export const Overlay = "div" as unknown as Props["Overlay"];
export const Progress = "div" as unknown as Props["Progress"];
export const Collapsable = "div" as unknown as Props["Collapsable"];
export const Ok = null as unknown as Props["Ok"];
export const Fail = null as unknown as Props["Fail"];

export type FormFeedbackView = "" | "ok" | "fail";

export const Form = ({
  Root: _Root,
  Overlay: _Overlay,
  Progress: _Progress,
  Collapsable: _Collapsable,
  ok,
  fail,
  loading,
  Ok: _Ok,
  okProps = {
    children: "Sent!",
  },
  Fail: _Fail,
  failProps = {
    children: "Failed.",
  },
  collapseOnOk,
  collapseOnFail,
  okTimeout = 3000,
  failTimeout = 3000,
  children,
  ...props
}: FormProps) => {
  const [open, setOpen] = useState<FormFeedbackView>("");
  const commonProps = {
    head: null,
    components: {
      HeadIcon: null,
    },
  };
  useEffect(() => {
    if (!loading) {
      if (ok) setOpen("ok");
      else if (fail) setOpen("fail");
    }
  }, [ok, fail, loading]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (open === "fail" && failTimeout) {
      timeout = setTimeout(() => setOpen(""), failTimeout);
    } else if (open === "ok" && okTimeout) {
      timeout = setTimeout(() => setOpen(""), okTimeout);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [open, failTimeout, okTimeout]);

  let formExpanded = true;
  if (collapseOnFail && fail) formExpanded = false;
  if (collapseOnOk && ok) formExpanded = false;

  return (
    <Root method="post" noValidate {...props}>
      <Collapsable
        {...commonProps}
        $open={formExpanded}
        recalc={loading}
        body={
          <>
            {children}
            {loading && (
              <Overlay>
                <Progress />
              </Overlay>
            )}
          </>
        }
      />
      <Collapsable
        {...commonProps}
        $open={open === "ok" && !loading}
        body={<Ok {...okProps} />}
      />
      <Collapsable
        {...commonProps}
        $open={open === "fail" && !loading}
        body={<Fail {...failProps} />}
      />
    </Root>
  );
};

export const KoineForm = extendComponent(Form, {
  Root,
  Overlay,
  Progress,
  Collapsable,
  Ok,
  Fail,
});

// export default Form;
