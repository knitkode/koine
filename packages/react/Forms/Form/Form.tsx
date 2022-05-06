import { useEffect, useState } from "react";
import styled from "styled-components";
import { overlay, centered } from "../../styles/styled";
import { Collapsable } from "../../Collapsable";
import { ProgressCircular } from "../../Progress";
import { Alert } from "../../Alert";

export const FormRoot = styled.form`
  position: relative;
`;

export const FormOverlay = styled.div`
  z-index: 4;
  ${overlay}
  ${centered}
  background: rgba(var(--bodyBg--rgb),.8);
  pointer-events: none;
  backdrop-filter: blur(2px);
`;

export const FormFeedback = styled(Alert)`
  padding: 2em 0;
`;

export type FormProps = React.ComponentPropsWithoutRef<"form"> & {
  action: string;
  ok?: boolean;
  Ok?: typeof FormFeedback;
  okProps?: object;
  fail?: boolean;
  Fail?: typeof FormFeedback;
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
};

type FormFeedbackView = "" | "ok" | "fail";

export const Form = ({
  ok,
  fail,
  loading,
  Ok = FormFeedback,
  okProps = {
    children: "Sent!",
  },
  Fail = FormFeedback,
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
  const [expanded, setExpanded] = useState<FormFeedbackView>("");
  const commonProps = {
    head: null,
    components: {
      HeadIcon: null,
    },
  };
  useEffect(() => {
    if (!loading) {
      if (ok) setExpanded("ok");
      else if (fail) setExpanded("fail");
    }
  }, [ok, fail, loading]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (expanded === "fail" && failTimeout) {
      timeout = setTimeout(() => setExpanded(""), failTimeout);
    } else if (expanded === "ok" && okTimeout) {
      timeout = setTimeout(() => setExpanded(""), okTimeout);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [expanded, failTimeout, okTimeout]);

  let formExpanded = true;
  if (collapseOnFail && fail) formExpanded = false;
  if (collapseOnOk && ok) formExpanded = false;

  return (
    <FormRoot method="post" noValidate {...props}>
      <Collapsable
        {...commonProps}
        expanded={formExpanded}
        recalc={loading}
        body={
          <>
            {children}
            {loading && (
              <FormOverlay>
                <ProgressCircular size="2em" color="var(--accent300)" />
              </FormOverlay>
            )}
          </>
        }
      />
      <Collapsable
        {...commonProps}
        expanded={expanded === "ok" && !loading}
        body={<Ok {...okProps} />}
      />
      <Collapsable
        {...commonProps}
        expanded={expanded === "fail" && !loading}
        body={<Fail {...failProps} />}
      />
    </FormRoot>
  );
};
