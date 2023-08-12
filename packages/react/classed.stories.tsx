// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck These are just wip experiments, we stick to just `./classed.tsx`
import { Meta, Story } from "@storybook/react";
import React, { createElement } from "react";
import { classed } from "./classed";

type SharedClassedProps = React.PropsWithChildren<{
  test?: string;
  className?: string;
}>;

const Classed = classed<SharedClassedProps>("div")`< class="bg-red-400 ${(p) =>
  p.test === "0a" ? "py-3" : "px-3"}`;

function classedOriginal<P extends {}>(
  type: React.ElementType,
  ...className: string[]
): (props?: (React.Attributes & P) | null) => React.FunctionComponentElement<P>;

function classedOriginal<
  T extends keyof JSX.IntrinsicElements,
  P extends JSX.IntrinsicElements[T],
>(
  type: keyof JSX.IntrinsicElements,
  ...className: string[]
): (props?: (React.ClassAttributes<T> & P) | null) => React.ReactElement<P, T>;

/**
 * Adapted (removed `classnames` dependency) from:
 * @see https://daily.dev/blog/my-tailwind-css-utility-function-for-creating-reusable-react-components-typescript-support
 *
 * See also [classname-hoc](https://www.npmjs.com/package/classname-hoc)
 */
function classedOriginal<P extends {}>(
  type: React.ElementType | keyof JSX.IntrinsicElements,
  ...className: string[]
): (
  props?: (React.Attributes & P & { className?: string }) | null,
) => React.ReactElement<P> {
  return function (props) {
    return createElement(type, {
      ...props,
      className: [props?.className || ""].concat(className).join(" "),
    });
  };
}

const ClassedOriginal = classedOriginal<SharedClassedProps>(
  "div",
  "bg-slate-800",
);

function classedBind<Props extends {} = {}>(
  this: React.ReactElement<{
    as: React.ElementType;
    className?: string;
  }>,
  props: Props,
) {
  // @ts-expect-error no time now
  const classNameImpl = props.className ? " " + props.className : "";
  // return <this className={this.props.className + classNameImpl} {...props} />;
  return createElement(
    this.props.as || this.type,
    {
      ...props,
      className: this.props.className + classNameImpl,
    },
    // @ts-expect-error no time now
    props.children,
  );
}

const ClassedBind = classedBind.bind<SharedClassedProps>(
  <div as={"h2"} className="bg-slate-800" />,
);

function classedDynamic(
  ComponentFn: (
    props: React.PropsWithChildren<{
      className?: string;
    }>,
  ) => any,
) {
  return function (propsImplementation) {
    const { props, type } = ComponentFn(propsImplementation);
    const classNameDefault = props.className ? " " + props.className : "";
    return createElement(props.as || type, {
      ...props,
      ...propsImplementation,
      className: propsImplementation?.className + classNameDefault,
    });
  };
}

const ClassedDynamicIgnoringProps = classedDynamic(() => (
  <div as={"h2"} className="bg-slate-800" />
));

const ClassedDynamicUsingProps = classedDynamic((p: SharedClassedProps) => {
  return (
    <div
      as={"h2"}
      className={`bg-slate-800 ${p?.test === "3" ? "py-3" : "px-3"}`}
    />
  );
});

// type ExtractComponent<ComponentString extends string> =
//   ComponentString extends `<${infer ComponentName} class="${infer ClassNames}`
//     ? { name: ComponentName; className: ClassNames }
//     : { error: "Cannot parse Component string" };

// type ExtractedComponent<T extends string> = ExtractComponent<T>;

function classedTaggedStatic<Props extends {} = {}, T extends string = string>(
  value: T = "" as T,
) {
  // @ts-expect-error we rely on correct implementation and assume it always matches
  const componentName = value.match(/<(.*?)\s/)[1];
  // @ts-expect-error we rely on correct implementation and assume it always matches
  const classDefault = value.match(/class="(.+)/)[1];

  return function (props: Props) {
    // @ts-expect-error no time now
    const classCustom = props?.className ? " " + props?.className : "";
    return createElement(componentName, {
      ...props,
      className: classDefault + classCustom,
    });
  }; /*  as Component; */
}

const ClassedTaggedStatic = classedTaggedStatic<SharedClassedProps>(
  `<div class="bg-teal-400`,
);

export default {
  // component: KoineDialog,
  title: "Helpers/classed",
} as Meta;

const Template: Story<{}> = (args) => {
  return (
    <>
      <Classed className="text-yellow-200" test="0a">
        Classed taller
      </Classed>
      <Classed className="text-yellow-200" test="0b">
        Classed wider
      </Classed>
      <ClassedOriginal className="text-white">ClassedOriginal</ClassedOriginal>
      <ClassedBind className="text-white">ClassedBind</ClassedBind>
      <ClassedDynamicIgnoringProps className="text-gray-300" test="2">
        ClassedDynamicIgnoringProps
      </ClassedDynamicIgnoringProps>
      <ClassedDynamicUsingProps className="text-gray-600" test="3">
        ClassedDynamicUsingProps
      </ClassedDynamicUsingProps>
      <ClassedTaggedStatic className="text-gray-600">
        ClassedTaggedStatic
      </ClassedTaggedStatic>
    </>
  );
};

export const Playground = Template.bind({});

Playground.args = {};
