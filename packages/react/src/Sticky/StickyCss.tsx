import { FC } from "react";

export type StickyCssProps = {
  top: number;
};

export const StickyCss: FC<StickyCssProps> = ({ top, ...props }) => {
  return <div style={{ position: "sticky", top: 100 }} {...props} />;
};
