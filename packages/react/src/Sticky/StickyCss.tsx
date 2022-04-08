export type StickyCssProps = {
  top: number;
};

export const StickyCss: React.FC<StickyCssProps> = ({ top, ...props }) => {
  return <div style={{ position: "sticky", top: 100 }} {...props} />;
};
