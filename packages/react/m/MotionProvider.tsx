import { LazyMotion, LazyProps } from "framer-motion";

export type MotionProviderFeatures = LazyProps["features"];

export type MotionProviderProps = LazyProps & React.PropsWithChildren<{}>;

/**
 * `<LazyMotion />` provider wrapper from `framer-motion`
 *
 * @see https://www.framer.com/docs/guide-reduce-bundle-size/
 *
 * About the difference between `lite` and `max`
 * @see https://www.framer.com/docs/guide-reduce-bundle-size/#available-features
 *
 * @example
 *
 * `lite` version:
 * ```tsx
 * import { MotionProvider } from "@koine/react/m";
 *
 * const features = () => import("@koine/react/m/lite").then((m) => m.default);
 *
 * <MotionProvider features={features}>
 *   <App />
 * </MotionProvider>
 * ```
 *
 * ### `max` version
 * ```tsx
 * import { MotionProvider } from "@koine/react/m";
 *
 * const features = () => import("@koine/react/m/max").then((m) => m.default);
 *
 * <MotionProvider features={features}>
 *   <App />
 * </MotionProvider>
 * ```
 */
export const MotionProvider = ({ features, children }: MotionProviderProps) => {
  return <LazyMotion features={features}>{children}</LazyMotion>;
};

export default MotionProvider;
