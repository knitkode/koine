/**
 * Nx types
 *
 * Allow to embed SVGs as both URLs string and as React components
 */
declare module "*.svg" {
  const content: unknown;
  export const ReactComponent: import("react").FC<
    import("react").ComponentProps<"svg">
  >;
  export default content;
}
