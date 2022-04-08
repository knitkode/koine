import { createElement } from "react";

function classed<P extends Record<string, never>>(
  type: React.ElementType,
  ...className: string[]
): (props?: (React.Attributes & P) | null) => React.FunctionComponentElement<P>;

function classed<
  T extends keyof JSX.IntrinsicElements,
  P extends JSX.IntrinsicElements[T]
>(
  type: keyof JSX.IntrinsicElements,
  ...className: string[]
): (props?: (React.ClassAttributes<T> & P) | null) => React.ReactElement<P, T>;

/**
 * Adapted (removed `classnames` dependency) from:
 * @see https://daily.dev/blog/my-tailwind-css-utility-function-for-creating-reusable-react-components-typescript-support
 */
function classed<P extends Record<string, never>>(
  type: React.ElementType | keyof JSX.IntrinsicElements,
  ...className: string[]
): (
  props?: (React.Attributes & P & { className?: string }) | null
) => React.ReactElement<P> {
  return function Classed(props) {
    return createElement(type, {
      ...props,
      className: [props?.className || ""].concat(className).join(" "),
    });
  };
}

export default classed;
