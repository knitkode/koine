import React, {
  Attributes,
  ClassAttributes,
  ElementType,
  FunctionComponentElement,
  ReactElement,
} from "react";

function classed<P extends Record<string, never>>(
  type: ElementType,
  ...className: string[]
): (props?: (Attributes & P) | null) => FunctionComponentElement<P>;

function classed<
  T extends keyof JSX.IntrinsicElements,
  P extends JSX.IntrinsicElements[T]
>(
  type: keyof JSX.IntrinsicElements,
  ...className: string[]
): (props?: (ClassAttributes<T> & P) | null) => ReactElement<P, T>;

/**
 * Adapted (removed `classnames` dependency) from:
 * @see https://daily.dev/blog/my-tailwind-css-utility-function-for-creating-reusable-react-components-typescript-support
 */
function classed<P extends Record<string, never>>(
  type: ElementType | keyof JSX.IntrinsicElements,
  ...className: string[]
): (
  props?: (Attributes & P & { className?: string }) | null
) => ReactElement<P> {
  return function Classed(props) {
    return React.createElement(type, {
      ...props,
      className: [props?.className || ""].concat(className).join(" "),
    });
  };
}

export default classed;
