import { buildUrlQueryString } from "@koine/utils";

type _Response = Response;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace KoineApi {
  export type ResponseSuccesfull = unknown;

  export type ResponseFailed = unknown;

  export type ResponseShared<T extends Record<string, unknown> = {}> = T & {
    status: _Response["status"];
    msg: _Response["statusText"];
  };

  export type Response<
    Succesfull extends ResponseSuccesfull = ResponseSuccesfull,
    Failed extends ResponseFailed = ResponseFailed
  > =
    | {
        status: _Response["status"];
        msg: _Response["statusText"];
        ok: true;
        fail?: false;
        data: Succesfull;
      }
    | {
        status: _Response["status"];
        msg: _Response["statusText"];
        ok?: false;
        fail: true;
        data: Failed;
      };

  /**
   * Request options
   */
  export type RequestOptions<TJson = unknown> = {
    /**
     * JSON request body
     *
     * @default {}
     */
    json?: TJson;
    /**
     * Params will be serialized into a string and appended to the URL
     */
    params?: Record<string, unknown>;
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
  };

  export type RequestMethod = "get" | "post" | "put" | "patch" | "delete";

  // export type RequestArgs = /* [string] |  */ [string, KoineApi.RequestOptions];

  export type RequestFn = <
    Succesfull extends ResponseSuccesfull = unknown,
    Failed extends ResponseFailed = unknown
  >(
    endpoint: string,
    options?: RequestOptions
  ) => Promise<Response<Succesfull, Failed>>;

  export type Client = Record<RequestMethod, RequestFn>;
}

export const api = (
  ["get", "post", "put", "patch", "delete"] as KoineApi.RequestMethod[]
).reduce((api, method) => {
  api[method] = async <
    Succesfull extends KoineApi.ResponseSuccesfull = unknown,
    Failed extends KoineApi.ResponseFailed = unknown
  >(
    endpoint: string,
    options: KoineApi.RequestOptions = {}
  ) => {
    const { json = {}, params, headers = {}, timeout = 10000 } = options;
    const requestInit: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        "content-type": "application/json",
        ...headers,
      },
    };

    const timeoutNumber = Number(timeout);
    let controller: AbortController;
    let timeoutId;
    let url = `/api/${endpoint.replace(/^\/*/, "")}`;

    if (method !== "get") {
      requestInit.body = JSON.stringify(json);
    }
    if (timeoutNumber > 0) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), timeoutNumber);
      requestInit.signal = controller.signal;
    }
    if (params) {
      url += buildUrlQueryString(params);
    }

    const response = await fetch(url, requestInit);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const result = (await response.json()) as KoineApi.Response<
      Succesfull,
      Failed
    >;
    return result;
  };
  return api;
}, {} as KoineApi.Client);
