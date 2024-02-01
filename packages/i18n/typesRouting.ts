// import type { Trim } from "@koine/utils";
type Whitespace = `\u{20}`;
type TrimLeft<V extends string> = V extends `${Whitespace}${infer R}`
  ? TrimLeft<R>
  : V;
type TrimRight<V extends string> = V extends `${infer R}${Whitespace}`
  ? TrimRight<R>
  : V;
/** A simplified version of `type-fest`'s `Trim` which creates too complex types */
type Trim<V extends string> = TrimLeft<TrimRight<V>>;

type WithDynamicPortion<F extends string, D extends GenericDelimiters> =
  | `${string}${F}${D["start"]}${string}${D["end"]}${F}${string}`
  | `${string}${F}${D["start"]}${string}${D["end"]}`
  | `${D["start"]}${string}${D["end"]}${F}${string}`
  | `${D["start"]}${string}${D["end"]}`;

type FilterOnlyStaticRouteId<
  T extends string,
  F extends string,
  D extends GenericDelimiters,
> = T extends WithDynamicPortion<F, D> ? never : T;

type FilterOnlyDynamicRouteId<
  T extends string,
  F extends string,
  D extends GenericDelimiters,
> = T extends WithDynamicPortion<F, D> ? T : never;

type InferredSeparator<T extends string> = T extends `${string}.${string}`
  ? "."
  : T extends `${string}/${string}`
    ? "/"
    : never;

type GenericDelimiters = {
  start: string;
  end: string;
};

type WithDelimitedString<Start extends string, End extends string> =
  | `${string}${Start}${string}${End}${string}`
  | `${string}${Start}${string}${End}`
  | `${Start}${string}${End}${string}`
  | `${Start}${string}${End}`;

type InferredDelimiters<T extends string> = T extends WithDelimitedString<
  "[",
  "]"
>
  ? { start: "["; end: "]" }
  : T extends WithDelimitedString<"{{", "}}">
    ? { start: "{{"; end: "}}" }
    : T extends WithDelimitedString<"{", "}">
      ? { start: "{"; end: "}" }
      : never;

/**
 * @borrows [awesome-template-literal-types](https://github.com/ghoullier/awesome-template-literal-types)
 */
// prettier-ignore
export type DynamicParams<
  T extends string,
  Separator extends string = InferredSeparator<T>,
  Delimiters extends GenericDelimiters = InferredDelimiters<T>,
> = string extends T
? Record<string, string>
: T extends `${string}${Delimiters["start"]}${infer Param}${Delimiters["end"]}${Separator}${infer Rest}`
    ? {
        [k in Trim<Param> | keyof DynamicParams<Rest>]: string | number;
      }
    : T extends `${string}${Delimiters["start"]}${infer Param}${Delimiters["end"]}`
      ? {
          [k in Trim<Param>]: string | number;
        }
      // : T extends `${Delimiters["start"]}${infer Param}${Delimiters["end"]}`
      //   ? {
      //       [k in Trim<Param>]: string | number;
      //     }
        // eslint-disable-next-line @typescript-eslint/ban-types
        : {};

export type RouteStrictIdStatic<T extends string> = FilterOnlyStaticRouteId<
  T,
  InferredSeparator<T>,
  InferredDelimiters<T>
>;

export type RouteStrictIdDynamic<T extends string> = FilterOnlyDynamicRouteId<
  T,
  InferredSeparator<T>,
  InferredDelimiters<T>
>;

export type RouteStrictId<T extends string> =
  | RouteStrictIdStatic<T>
  | RouteStrictIdDynamic<T>;
