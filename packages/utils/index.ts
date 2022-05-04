/**
 * @file 
 * 
 * TODO: libraries to encapsulate and re-export from here,
 * the selection is based on:
 * 
 * [x] full typescript support
 * [x] treeshake-ability
 * [x] docs in source comments
 * 
 * - https://github.com/mesqueeb/merge-anything
 * - https://github.com/mesqueeb/filter-anything
 * - https://github.com/mesqueeb/case-anything
 * - https://github.com/mesqueeb/nestify-anything
 * - https://github.com/mesqueeb/fast-sort (fork)
 * - https://github.com/mesqueeb/compare-anything
 * - https://github.com/mesqueeb/copy-anything
 * - https://github.com/mesqueeb/flatten-anything

 * About ts utilities types @see:
 * - https://github.com/sindresorhus/type-fest
 * - https://github.com/millsp/ts-toolbelt
 * - https://github.com/ts-essentials/ts-essentials
 * 
 * About utilities useful examples @see:
 * - https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src
 */

export * from "./analytics-google.js";
export * from "./arrays.js";
export * from "./async.js";
export * from "./cast.js";
export * from "./cookie.js";
export * from "./colors.js";
export * from "./env.js";
export * from "./emitter.js";
export * from "./is.js";
export * from "./location.js";
export * from "./match-sorter.js";
export * from "./math.js";
export * from "./misc.js";
export * from "./objects.js";
export * from "./security.js";
export * from "./ssr.js";
export * from "./text.js";
export * from "./typography.js";
export * from "./uid.js";

export type {
  Primitive,
  Class,
  Constructor,
  TypedArray,
  ObservableLike,
  Except,
  Mutable,
  Merge,
  MergeExclusive,
  RequireAtLeastOne,
  RequireExactlyOne,
  RequireAllOrNone,
  RemoveIndexSignature,
  PartialDeep,
  ReadonlyDeep,
  LiteralUnion,
  Opaque,
  InvariantOf,
  SetOptional,
  SetRequired,
  ValueOf,
  ConditionalKeys,
  ConditionalPick,
  ConditionalExcept,
  UnionToIntersection,
  LiteralToPrimitive,
  Stringified,
  IterableElement,
  Entry,
  Entries,
  SetReturnType,
  Simplify,
  Get,
  StringKeyOf,
  Schema,
  Jsonify,
  JsonPrimitive,
  JsonObject,
  JsonArray,
  JsonValue,
  Promisable,
  AsyncReturnType,
  Asyncify,
  Trim,
  Split,
  Includes,
  Join,
  LastArrayElement,
  FixedLengthArray,
  MultidimensionalArray,
  MultidimensionalReadonlyArray,
  PositiveInfinity,
  NegativeInfinity,
  Finite,
  Integer,
  Float,
  NegativeFloat,
  Negative,
  NonNegative,
  NegativeInteger,
  NonNegativeInteger,
  CamelCase,
  CamelCasedProperties,
  CamelCasedPropertiesDeep,
  KebabCase,
  KebabCasedProperties,
  KebabCasedPropertiesDeep,
  PascalCase,
  PascalCasedProperties,
  PascalCasedPropertiesDeep,
  SnakeCase,
  SnakeCasedProperties,
  SnakeCasedPropertiesDeep,
  ScreamingSnakeCase,
  DelimiterCase,
  DelimiterCasedProperties,
  DelimiterCasedPropertiesDeep,
  PackageJson,
  TsConfigJson,
} from "type-fest";
