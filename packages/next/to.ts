import type { TranslateNamespaced, TranslatedRoute } from "./types-i18n";

type OnlyStatic<T extends string> = T extends
  | `${string}.[${string}]`
  | `[${string}].${string}`
  | `[${string}]`
  ? T
  : never;

type OnlyDynamic<T extends string> = T extends
  | `${string}.[${string}]`
  | `[${string}].${string}`
  | `[${string}]`
  ? never
  : T;

/**
 * @borrows [awesome-template-literal-types](https://github.com/ghoullier/awesome-template-literal-types#router-params-parsing)
 */
type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}[${infer Param}].${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}[${infer Param}]`
  ? { [k in Param]: string }
  : {};

export type ToTranslate = TranslateNamespaced<"~">;

export type ToStaticRoute = OnlyStatic<TranslatedRoute>;

export type ToDynamicRoute = OnlyDynamic<TranslatedRoute>;

export type ToArgs =
  | [ToStaticRoute]
  | [ToDynamicRoute, ExtractRouteParams<ToDynamicRoute>];

/**
 * `To` named route utility. It accept either a single argument if that is a static
 * route name or a second argument that interpolates the dynamic portions of
 * the route name. The types of these portions are automatically inferred.
 *
 * @borrows [awesome-template-literal-types](https://github.com/ghoullier/awesome-template-literal-types)
 */
export function to(...args: [ToTranslate, ...ToArgs]) {
  let relative = "";
  const [t] = args;

  if (args.length === 3) {
    if (args[2]) {
      relative = t(args[1], args[2]);
    }
  } else if (args.length === 2) {
    relative = t(args[1]);
  }

  return relative;
}

export default to;
