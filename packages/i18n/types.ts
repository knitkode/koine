import type { JsonObject, Split } from "@koine/utils";
import { CodeDataTranslationsOptions } from "./compiler/code/data-translations";

export namespace I18nConfig {
  export type TranslationsFallback = CodeDataTranslationsOptions["fallback"];

  export type TranslationsFallbackStrategy =
    CodeDataTranslationsOptions["fallback"]["strategy"];
}

export namespace I18nUtils {
  export type Join<
    A,
    Sep extends string = "",
    R extends string = "",
  > = A extends [infer First, ...infer Rest]
    ? Join<
        Rest,
        Sep,
        R extends "" ? `${First & string}` : `${R}${Sep}${First & string}`
      >
    : R;

  export type BuildRecursiveJoin<TList, TSeparator extends string> = Exclude<
    TList extends [...infer ButLast, unknown]
      ? Join<ButLast, TSeparator> | BuildRecursiveJoin<ButLast, TSeparator>
      : never,
    ""
  >;

  type JoinObjectPath<S1, S2> = S1 extends string
    ? S2 extends string
      ? `${S1}.${S2}`
      : S1
    : never;

  /**
   * A very simplified version of `type-fest`'s `Get` type
   */
  type GetWithPath<BaseType, Keys extends readonly string[]> = Keys extends []
    ? BaseType
    : Keys extends readonly [infer Head, ...infer Tail]
      ? GetWithPath<
          Head extends keyof BaseType ? BaseType[Head] : unknown,
          Extract<Tail, string[]>
        >
      : never;

  /**
   * A very simplified version of `type-fest`'s `Get` type, its implementation
   * of square brackets doesn't match our convention as we always keep dots
   * around the brackets and the brackets do not mean dynamic object access but
   * just a dynamic portion of a route.
   */
  export type Get<
    BaseType,
    Path extends string | readonly string[],
  > = GetWithPath<BaseType, Path extends string ? Split<Path, "."> : Path>;

  /**
   * Recursive mapped type to extract all usable string paths from a translation
   * definition object (usually from a JSON file).
   * It uses the `infer` "trick" to store the object in memory and prevent
   * [infinite instantiation errors](https://stackoverflow.com/q/75531366/1938970)
   */
  export type Paths<T, TAsObj extends boolean = true> = {
    [K in Extract<keyof T, string>]: T[K] extends  // exclude empty objects, empty arrays, empty strings
      | Record<string, never>
      | never[]
      | ""
      ? never
      : // recursively manage objects
        T[K] extends Record<string, unknown>
        ?
            | (TAsObj extends true ? `${K}` : never) // this is to be able to use the "obj" shortcut
            | JoinObjectPath<K, Paths<T[K], TAsObj>>
        : // allow primitives or array of primitives
          // TODO: support array of objects recursively? For now we just stop at the array name
          T[K] extends
              | string
              | number
              | boolean
              | Array<string | number | boolean | object>
          ? `${K}`
          : // exclude anything else
            never;
  }[Extract<keyof T, string>] extends infer O
    ? O
    : never;

  /**
   * Recursive mapped type of all usable string paths from a whole dictionary.
   * It uses the `infer` "trick" to store the object in memory and prevent
   * [infinite instantiation errors](https://stackoverflow.com/q/75531366/1938970)
   */
  export type AllPaths<TDictionary extends JsonObject> = {
    [N in Extract<keyof TDictionary, string>]: {
      [K in Extract<keyof TDictionary[N], string>]: TDictionary[N][K] extends  // exclude empty objects, empty arrays, empty strings
        | Record<string, never>
        | never[]
        | ""
        ? never
        : // recursively manage objects
          TDictionary[N][K] extends Record<string, unknown>
          ?
              | `${N}:${K}` // this is to be able to use the "obj" shortcut
              | JoinObjectPath<
                  K extends string ? `${N}:${K}` : `${N}:`,
                  Paths<TDictionary[N][K]>
                >
          : // allow primitives or array of primitives
            // TODO: support array of objects recursively? For now we just stop at the array name
            TDictionary[N][K] extends
                | string
                | number
                | boolean
                | Array<string | number | boolean | object>
            ? `${N}:${K}`
            : // exclude anything else
              never;
    }[Extract<keyof TDictionary[N], string>];
  }[Extract<keyof TDictionary, string>] extends infer O
    ? O
    : never;

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

  type InferredDelimiters<T extends string> =
    T extends WithDelimitedString<"[", "]">
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
  ? Record<string, string | number>
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
}
