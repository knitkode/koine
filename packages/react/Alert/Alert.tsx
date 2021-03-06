import styled from "styled-components";

const AlertRoot = styled.div<Pick<AlertProps, "$danger">>`
  font-size: 12px;
  ${(p) => (p.$danger ? `color: var(--danger)` : "")}
`;

const AlertInner = styled.div`
  padding: 1em;
  background-color: rgba(0, 0, 0, 0.05);
  /* border: 1px solid var(--grey700); */
  /* background: pink; */
  /* color: red; */
`;

export type AlertProps = React.PropsWithChildren<{
  $danger?: boolean;
}>;

export const Alert = ({ $danger, children, ...props }: AlertProps) => {
  return (
    <AlertRoot $danger={$danger} {...props}>
      <AlertInner>{children}</AlertInner>
    </AlertRoot>
  );
};
