import styled from "styled-components";

const Root = styled.div<Pick<FeedbackProps, "$danger">>`
  margin-top: 0.2em;
  font-size: 12px;
  ${(p) => (p.$danger ? `color: var(--danger);` : "")}
`;

export type FeedbackProps = React.PropsWithChildren<{
  $danger?: boolean;
}>;

export const Feedback: React.FC<FeedbackProps> = ({ $danger, children }) => {
  return (
    <Root role="alert" $danger={$danger}>
      {children}
    </Root>
  );
};
