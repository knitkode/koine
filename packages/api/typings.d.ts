/* eslint-disable @typescript-eslint/no-unused-vars */

type _Response = Response;

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
     * Basic request options to supply to `fetch`
     *
     * @see RequestInit
     *
     * @default { credentials: "include", referrerPolicy: "no-referrer" }
     */
    request?: Omit<RequestInit, "body" | "headers" | "method">;
    adapter?: ResponseAdapter;
    shouldThrow?: boolean;
  };

  type ClientMethod<
    TMethod extends RequestMethod,
    TEndpoints extends Endpoints
  > = <
    TEndpoint extends EndpointUrl<TEndpoints>,
    TOptions extends EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>,
    TSuccesfull extends Koine.Api.DataSuccesfull = Koine.Api.EndpointResponseOk<
      TEndpoints,
      TEndpoint,
      TMethod
    >,
    TFailed extends Koine.Api.DataFailed = Koine.Api.EndpointResponseFail<
      TEndpoints,
      TEndpoint,
      TMethod
    >
  >(
    endpoint: TEndpoint,
    options?: TOptions
    // ) => Promise<EndpointResponse<TEndpoints, TEndpoint, TMethod>>;
  ) => Promise<Result<TSuccesfull, TFailed>>;

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

  type EndpointRequestOptions<
    TEndpoints extends Endpoints,
    TEndpoint extends EndpointUrl<TEndpoints>,
    TMethod extends RequestMethod
  > = RequestOptions<
    TMethod,
    TEndpoints[TEndpoint][Uppercase<TMethod>]["json"],
    TEndpoints[TEndpoint][Uppercase<TMethod>]["params"]
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

  type EndpointResponse<
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
    params?: RequestParams;
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

  type RequestJson = undefined | null | Record<string | number, unknown>;

  type RequestParams = undefined | null | Record<string | number, unknown>;

  /**
   * Shared request options (for every request method)
   *
   * Client options can be overriden here at request level.
   */
  type RequestOptionsShared = ClientOptions & {
    /**
     * Headers will be merged with
     * ```
     * { "content-type": "application/json" }
     * ```
     */
    headers?: RequestInit["headers"];
    /**
     * Timeout in `ms`, if `falsy` there is no timeout
     *
     * @default 10000
     */
    timeout?: number | false | null;
    /**
     * Basic request options to supply to `fetch`
     *
     * @see RequestInit
     *
     * @default { credentials: "include", referrerPolicy: "no-referrer" }
     */
    request?: Omit<RequestInit, "body" | "headers" | "method">;
  };

  /**
   * Request options
   *
   * Client options can be overriden here at request level.
   */
  type RequestOptions<
    TMethod extends RequestMethod,
    TJson extends Record<string, unknown> = {},
    TParams extends RequestParams = {}
  > = RequestOptionsShared &
    ([TMethod] extends ["get"]
      ? {
          /**
           * JSON request body
           */
          json?: TJson;
          /**
           * Params will be serialized into a string and appended to the URL
           */
          params?: TParams;
        }
      : {
          /**
           * JSON request body
           *
           * @default {}
           */
          json?: TJson;
          /**
           * Params will be serialized into a string and appended to the URL
           */
          params?: TParams;
        });

  type RequestMethod = "get" | "post" | "put" | "patch" | "delete";

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
    msg: _Response["statusText"];
    ok?: false;
    fail: true;
    data: TResponse;
  };

  type Result<
    TResponseOk extends ResponseOk,
    TResponseFail extends ResponseFail
  > =
    // FIXME: without the type duplication below the following two lines do not
    // work as they do not narrow the type when checking for the boolean values
    // truthiness
    // | ResultOk<TOk>
    // | ResultFail<TOk>;
    | {
        status: _Response["status"];
        msg: _Response["statusText"];
        ok: true;
        fail?: false;
        data: TResponseOk;
      }
    | {
        status: _Response["status"];
        msg: _Response["statusText"];
        ok?: false;
        fail: true;
        data: TResponseFail;
      };

  type ResponseAdapter = <
    TResponseOk extends ResponseOk = ResponseOk,
    TResponseFail extends ResponseFailed = ResponseFailed
  >(
    response: _Response,
    options: TOptions
  ) => Promise<Koine.Api.Result<TResponseOk, TResponseFail>>;

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
