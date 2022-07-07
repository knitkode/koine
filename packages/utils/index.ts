/**
 * @file 
 * 
 * Libraries to encapsulate and re-export from here, the selection is based on:
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
 * 
 * TODO:
 * We could also re-exports direct dependencies of packages that we often use
 * anyway like [those of `yup`](https://github.com/jquense/yup/blob/master/package.json#L103):
 * 
 * - [tiny-case](https://github.com/jquense/tiny-case)
 * - [property-expr](https://github.com/jquense/expr/blob/master/index.js)
 * - [toposort](https://github.com/marcelklehr/toposort)
 */

export * from "./accentSets";
export * from "./addOrReplaceAtIdx";
export * from "./arrayToLookup";
export * from "./buildUrlQueryString";
export * from "./changeUrlPath";
export * from "./chunkByChunks";
export * from "./chunkBySize";
export * from "./clamp";
export * from "./clsx";
export * from "./convertRange";
export * from "./cookie";
export * from "./createStorage";
export * from "./decode";
export * from "./Defer";
export * from "./Emitter";
export * from "./encode";
export * from "./ensureInt";
// export * from "./env"
export * from "./findDuplicatedIndexes";
export * from "./getKeys";
export * from "./getNonce";
export * from "./getType";
export * from "./getUrlHashParams";
export * from "./getUrlHashPathname";
export * from "./getUrlPathnameParts";
export * from "./getUrlQueryParams";
export * from "./imgEmptyPixel";
export * from "./isAnyObject";
export * from "./isArray";
export * from "./isBlob";
export * from "./isBoolean";
export * from "./isBrowser";
export * from "./isDate";
export * from "./isEmptyArray";
export * from "./isEmptyObject";
export * from "./isEmptyString";
export * from "./isError";
export * from "./isExternalUrl";
export * from "./isFile";
export * from "./isFloat";
export * from "./isFormData";
export * from "./isFullArray";
export * from "./isFullObject";
export * from "./isFullString";
export * from "./isFunction";
export * from "./isIE";
export * from "./isInt";
export * from "./isMap";
export * from "./isMobile";
export * from "./isNaNValue";
export * from "./isNegativeNumber";
export * from "./isNullOrUndefined";
export * from "./isNull";
export * from "./isNumber";
export * from "./isObjectLike";
export * from "./isObject";
export * from "./isOneOf";
export * from "./isPlainObject";
export * from "./isPositiveNumber";
export * from "./isPrimitive";
export * from "./isPromise";
export * from "./isRegExp";
export * from "./isServer";
export * from "./isSet";
export * from "./isString";
export * from "./isSymbol";
export * from "./isType";
export * from "./isUndefined";
export * from "./isWeakMap";
export * from "./isWeakSet";
export * from "./location";
export * from "./mapListBy";
export * from "./matchSorter";
export * from "./mergeObjects";
export * from "./mergeUrlQueryParams";
export * from "./navigateToHashParams";
export * from "./navigateToMergedHashParams";
export * from "./navigateToMergedParams";
export * from "./navigateToParams";
export * from "./navigateWithoutUrlParam";
export * from "./normaliseUrlPathname";
export * from "./normaliseUrl";
export * from "./objectPick";
export * from "./objectOmit";
export * from "./pageview";
export * from "./parseCookie";
export * from "./parseURL";
export * from "./randomInt";
export * from "./randomKey";
export * from "./readCookie";
export * from "./redirectTo";
export * from "./removeAccents";
export * from "./removeCookie";
export * from "./removeDuplicatesByKey";
export * from "./removeDuplicatesComparing";
export * from "./removeIndexesFromArray";
export * from "./removeTrailingSlash";
export * from "./removeUrlQueryParams";
export * from "./roundTo";
export * from "./serializeCookie";
export * from "./setCookie";
export * from "./shuffle";
export * from "./slugify";
export * from "./swapMap";
export * from "./titleCase";
export * from "./toNumber";
export * from "./toRgba";
export * from "./transformToUrlPathname";
export * from "./truncate";
export * from "./uid";
export * from "./updateLinkParams";
export * from "./updateUrlQueryParams";
export * from "./uuid";
export * from "./wait";

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
