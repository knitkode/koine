export type StickyCssProps = React.ComponentProps<"div"> & {
  top: number;
};

export const StickyCss = ({ top, ...props }: StickyCssProps) => {
  return <div style={{ position: "sticky", top: 100 }} {...props} />;
};
