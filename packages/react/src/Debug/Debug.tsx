import styled from "styled-components";

const Root = styled.div`
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-left: 3px solid #f36d33;
  color: #666;
  page-break-inside: avoid;
  font-family: monospace;
  font-size: small;
  line-height: 1.6;
  margin-bottom: 1.6em;
  max-width: 100%;
  overflow: auto;
  padding: 1em 1.5em;
  display: block;
  word-wrap: break-word;
`;

export type DebugProps = {
  data: object;
};

export const Debug = ({ data }: DebugProps) => {
  return <Root>{JSON.stringify(data, undefined, 2)}</Root>;
};
