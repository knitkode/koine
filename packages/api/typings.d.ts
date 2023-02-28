/* eslint-disable @typescript-eslint/no-unused-vars */

type _Response = Response;

/**
 * @borrows [awesome-template-literal-types](https://github.com/ghoullier/awesome-template-literal-types#router-params-parsing)
 */
type ExtractEndpointParams<T extends string> = string extends T
  ? Record<string, string>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
  ? { [k in Param | keyof ExtractEndpointParams<Rest>]: string | number }
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _Start}{${infer Param}}`
  ? { [k in Param]: string | number }
  : never;

declare namespace Koine.Api {
  // @see https://stackoverflow.com/a/60702896/1938970
  // import { Exact } from "type-fest";

  //////////////////////////////////////////////////////////////////////////////
  //
  // Client
  //
  //////////////////////////////////////////////////////////////////////////////

  type ClientCreator<TEndpoints extends Endpoints> = (
    apiName: string,
    baseUrl: string,
    options?: ClientOptions
  ) => Client<TEndpoints>;

  type ClientOptions = {
    /**
     * Headers will be merged with
     * ```
     * { "content-type": "application/json" }
     * ```
     *
     * @default {}
     */
    headers?: RequestInit["headers"];
    /**
     * Basic request options to supply to `fetch`
     *
     * @see RequestInit
     *
     * @default { credentials: "include", referrerPolicy: "no-referrer" }
     */
    request?: Omit<RequestInit, "body" | "headers" | "method">;
    /**
     * Flag to throw error within the catch block, by default we return a
     * normalised error result {@link ResultFail}
     *
     * @default false
     */
    throwErr?: boolean;
    /**
     * Timeout in `ms`, if `falsy` there is no timeout
     *
     * @default 10000
     */
    timeout?: number | false | null;
    /**
     * Process request before actual http call
     *
     * @default undefined
     */
    processReq?: RequestProcessor;
    /**
     * Process ok/failed response just after http response
     *
     * @default undefined
     */
    processRes?: ResponseProcessorRes;
    /**
     * Process maybe-thrown error originated either from `fetch` function
     * invokation or from its `response.json()` parsing
     *
     * @default undefined
     */
    processErr?: ResponseProcessorErr;
  };

  type ClientMethod<
    TMethod extends RequestMethod,
    TEndpoints extends Endpoints
  > = <
    TEndpoint extends EndpointUrl<TEndpoints>,
    TOptions extends EndpointOptions<TEndpoints, TEndpoint, TMethod>,
    TOk extends ResponseOk = EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
    TFail extends ResponseFail = EndpointResponseFail<
      TEndpoints,
      TEndpoint,
      TMethod
    >
  >(
    endpoint: TEndpoint,
    options?: TOptions
  ) => Promise<EndpointResult<TEndpoints, TEndpoint, TMethod>>;
  // ) => Promise<Result<TOk, TFail>>;

  /**
   * The `api` interface generated by `createApi`
   */
  type Client<TEndpoints extends Endpoints> = {
    [TMethod in RequestMethod]: ClientMethod<TMethod, TEndpoints>;
  };

  //////////////////////////////////////////////////////////////////////////////
  //
  // Endpoints
  //
  //////////////////////////////////////////////////////////////////////////////

  type EndpointOptions<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = RequestOptions<
    TEndpoints,
    TEndpoint,
    TMethod,
    TEndpoints[TEndpoint][Uppercase<TMethod>]["json"],
    TEndpoints[TEndpoint][Uppercase<TMethod>]["query"]
  >;

  type EndpointResultOk<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = ResultOk<TEndpoints[TEndpoint][Uppercase<TMethod>]["ok"]>;

  type EndpointResultFail<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = ResultFail<TEndpoints[TEndpoint][Uppercase<TMethod>]["fail"]>;

  type EndpointResponseOk<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = TEndpoints[TEndpoint][Uppercase<TMethod>]["ok"];

  type EndpointResponseFail<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = TEndpoints[TEndpoint][Uppercase<TMethod>]["fail"];

  type EndpointResult<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = Result<
    EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
    EndpointResponseFail<TEndpoints, TEndpoint, TMethod>
  >;

  //////////////////////////////////////////////////////////////////////////////
  //
  // Definitions
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Validate the `Endpoints` definition against the `Endpoint` shape defined
   * here.
   *
   * FIXME: this does not work yet...constraining the API endpoints definitions
   *
   * @see https://github.com/sindresorhus/type-fest/blob/main/source/exact.d.ts
   * @see https://fettblog.eu/typescript-match-the-exact-object-shape/
   * @see https://stackoverflow.com/a/51496652/1938970
   * @see https://github.com/Microsoft/TypeScript/issues/12936
   */
  // type DefineEndpoint<T> =
  //   T extends Endpoint ?
  //   Exclude<keyof T, keyof Endpoint> extends never ?
  //   T : "Endpoint must follow `Koine.Api.Endpoint` shape" : never;
  type DefineEndpoint<T extends EndpointShape> = T;
  type DefineEndpoints<T extends Endpoints> = {};
  type EndpointShape = {
    [TMethod in Uppercase<RequestMethod>]?: DataTypes<TMethod>;
  };

  type Endpoints = Record<string, Endpoint>;
  type Endpoint = {
    [TMethod in Uppercase<RequestMethod>]?: DataTypes<TMethod>;
  };

  type EndpointUrl<TEndpoints extends Endpoints> = Extract<
    keyof TEndpoints,
    string
  >;

  type DataTypes<TMethod extends Uppercase<RequestMethod>> = {
    /**
     * The request body of a non-GET request
     */
    json?: RequestJson;
    /**
     * The parameters to encode in the URL of the request
     */
    query?: RequestQuery;
    /**
     * The JSON response data returned by the request in case of success
     */
    ok?: null | unknown;
    /**
     * The shape of the error data returned by the request in case of
     * failure
     */
    fail?: null | unknown;
  };

  //////////////////////////////////////////////////////////////////////////////
  //
  // Request
  //
  //////////////////////////////////////////////////////////////////////////////

  type RequestMethod = "get" | "post" | "put" | "patch" | "delete";

  type RequestJson = unknown;

  type RequestQuery = unknown;

  type RequestParams = unknown;

  /**
   * Request options
   *
   * `ClientOptions` can be overriden here at the single request level.
   */
  type RequestOptions<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod,
    TJson extends RequestJson,
    TQuery extends RequestQuery
  > = Omit<ClientOptions, "processReq"> & {
    processReq?: EndpointRequestProcessor<TEndpoints, TEndpoint, TMethod>;
    /**
     * A dictionary to dynamically interpolate endpoint url params, e.g.:
     *
     * ```js
     * myapi.get("user/{id}", { path: { id: "12" }})
     * ```
     * results in a call to the endpoint `"user/12"`
     */
    params?: ExtractEndpointParams<TEndpoint>;
    /**
     * Query parameters will be serialized into a string and appended to the URL
     */
    query?: TQuery;
    /**
     * JSON request body
     */
    json?: TJson;
  };

  //////////////////////////////////////////////////////////////////////////////
  //
  // Response/Result
  //
  //////////////////////////////////////////////////////////////////////////////

  type ResponseOk = unknown;

  type ResponseFail = unknown;

  type ResultShared<
    T extends Record<string, unknown> = Record<string, unknown>
  > = T & {
    status: _Response["status"];
    msg: _Response["statusText"];
  };

  type ResultOk<TResponse extends ResponseOk = ResponseOk> = {
    status: _Response["status"];
    msg: _Response["statusText"];
    ok: true;
    fail?: false;
    data: TResponse;
  };

  type ResultFail<TResponse extends ResponseFail = ResponseFail> = {
    status: _Response["status"];
    msg: Error["message"] | _Response["statusText"];
    ok?: false;
    fail: true;
    data: TResponse;
  };

  type Result<
    TResponseOk extends ResponseOk,
    TResponseFail extends ResponseFail
  > =
    | {
        status: _Response["status"];
        msg: _Response["statusText"];
        ok: true;
        fail?: false;
        data: TResponseOk;
      }
    | {
        status: _Response["status"];
        msg: Error["message"] | _Response["statusText"];
        ok?: false;
        fail: true;
        data: TResponseFail;
      };

  /**
   * The request processor at the client level, this is meant to apply global
   * transformations to all endpoints requests
   */
  type RequestProcessor = (
    method: RequestMethod,
    url: string,
    query: any,
    json: any,
    params: any,
    requestInit: RequestInit
  ) => [
    string, // url
    RequestQuery, // query
    RequestJson, // json
    RequestParams, // params
    RequestInit // requestInit
  ];

  /**
   * The request processor at the request level, this is meant to apply
   * transformations to a single endpoint request. Request processor applied at
   * the whole client level is still applied just before this one, hence one
   * might set some global processing and override it or undo it at the single
   * request level.
   */
  type EndpointRequestProcessor<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = (
    method: TMethod,
    url: string,
    query: EndpointOptions<TEndpoints, TEndpoint, TMethod>["query"],
    json: EndpointOptions<TEndpoints, TEndpoint, TMethod>["json"],
    params: EndpointOptions<TEndpoints, TEndpoint, TMethod>["params"],
    requestInit: RequestInit
  ) => [
    string, // url
    EndpointOptions<TEndpoints, TEndpoint, TMethod>["query"], // query
    EndpointOptions<TEndpoints, TEndpoint, TMethod>["json"], // json
    EndpointOptions<TEndpoints, TEndpoint, TMethod>["params"], // params
    RequestInit // requestInit
  ];

  /**
   * The ok/fail response processor at the request level, this is meant to apply
   * transformations to a single or all endpoint responses
   */
  type ResponseProcessorRes = <TResponseOk extends ResponseOk = ResponseOk>(
    response: _Response,
    options: TOptions
  ) => Promise<Koine.Api.Result<TResponseOk>>;

  /**
   * The error response processor at the request level, this is meant to apply
   * transformations to a single or all endpoint responses
   */
  type ResponseProcessorErr = <
    TResponseFail extends ResponseFailed = ResponseFailed
  >(
    msg: string,
    options: TOptions
  ) => Promise<Koine.Api.Result<TResponseFail>>;

  //////////////////////////////////////////////////////////////////////////////
  //
  // Hooks
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Api hooks map for `react`, each request method has its own `use{Method}`
   * hook.
   *
   * These hooks are implemented with different libraries or, in the future as
   * standalone hooks, see SWR ones to start with.
   */
  type HooksMaps = {
    [TMethod in RequestMethod]: `use${Capitalize<TMethod>}`;
  };

  type HooksMapsByName = { [K in keyof HooksMaps as HooksMaps[K]]: K };

  //////////////////////////////////////////////////////////////////////////////
  //
  // Generate shortcuts
  //
  //////////////////////////////////////////////////////////////////////////////

  /**
   * To generate all available helpers use in your `API` types:
   *
   * ```ts
   * type Response = Koine.Api.GenerateResponseHelpers<Endpoints>;
   * type Request = Koine.Api.GenerateRequestHelpers<Endpoints>;
   * type Get = Koine.Api.GenerateGetHelpers<Endpoints>;
   * type Post = Koine.Api.GeneratePostHelpers<Endpoints>;
   * ```
   */
  type Generate = "here just to read the example usage";

  type _ShortcutsMaps = {
    [TMethod in RequestMethod]: Capitalize<TMethod>;
  };

  type _ShortcutsMapsByMethod = {
    [K in keyof _ShortcutsMaps as _ShortcutsMaps[K]]: K;
  };

  /**
   * @example
   * ```ts
   * // define the type on your `API` types:
   * type Response = Koine.Api.GenerateResponseShortcuts<Endpoints>;
   *
   * // consume the type wherever in your app:
   * type MyData = API.Response["get"]["my/endpoint"];
   * ```
   */
  type GenerateResponseShortcuts<TEndpoints extends Endpoints> = {
    [TMethod in RequestMethod]: {
      [TEndpointUrl in keyof TEndpoints]: TEndpoints[TEndpointUrl][Uppercase<TMethod>]["ok"];
    };
  };

  /**
   * @example
   * ```ts
   * // define the type on your `API` types:
   * type Request = Koine.Api.GenerateRequestShortcuts<Endpoints>;
   *
   * // consume the type wherever in your app:
   * type MyData = API.Request["get"]["my/endpoint"];
   * ```
   */
  type GenerateRequestShortcuts<TEndpoints extends Endpoints> = {
    [TMethod in RequestMethod]: {
      [TEndpointUrl in keyof TEndpoints]: TMethod extends "get"
        ? TEndpoints[TEndpointUrl][Uppercase<TMethod>]["query"]
        : TEndpoints[TEndpointUrl][Uppercase<TMethod>]["json"];
    };
  };

  /**
   * @example
   * ```ts
   * // define the type on your `API` types:
   * type Get = Koine.Api.GenerateResponseShortcuts<Endpoints>;
   *
   * // consume the type wherever in your app:
   * type MyData = API.Get["my/endpoint"];
   * ```
   */
  type GenerateGetShortcuts<TEndpoints extends Endpoints> = {
    [TEndpointUrl in keyof TEndpoints]: TEndpoints[TEndpointUrl]["GET"]["ok"];
  };

  /**
   * @example
   * ```ts
   * // define the type on your `API` types:
   * type Post = Koine.Api.GenerateResponseShortcuts<Endpoints>;
   *
   * // consume the type wherever in your app:
   * type MyData = API.Post["my/endpoint"];
   * ```
   */
  type GeneratePostShortcuts<TEndpoints extends Endpoints> = {
    [TEndpointUrl in keyof TEndpoints]: TEndpoints[TEndpointUrl]["POST"]["ok"];
  };

  /**
   * This is not useful as it is the same as doing
   * `API.Endpoints["my/endpoint"]["GET"]["ok"];`
   *
   * @example
   * ```ts
   * // define the type on your `API` types:
   * type Response = Koine.Api.GenerateResponseShortcuts<Endpoints>;
   *
   * // consume the type wherever in your app:
   * type MyData = API.$["my/endpoint"]["get"]["ok"];
   * ```
   * @deprecated
   */
  // type GenerateAllShortcuts<TEndpoints extends Endpoints> = {
  //   [TEndpointUrl in keyof TEndpoints]: {
  //     [TMethod in RequestMethod]: {
  //       [DataType in EndpointDataType]: TEndpoints[TEndpointUrl][Uppercase<TMethod>][DataType];
  //     }
  //   }
  // }
}
