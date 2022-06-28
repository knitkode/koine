import { buildUrlQueryString } from "@koine/utils";

/**
 * Custom `ApiError` class extending `Error` to throw in failed response.
 *
 * @see https://eslint.org/docs/rules/no-throw-literal
 * @see https://github.com/sindresorhus/ky/blob/main/source/errors/HTTPError.ts
 *
 */
export class ApiError<
  TResponseFail extends Koine.Api.ResponseFail = unknown
> extends Error {
  constructor(result: Koine.Api.ResultFail<TResponseFail>) {
    super(`Request failed with ${result.status} ${result.msg}`);
    this.name = "ApiError";
    Object.assign(this, result);
  }
}

/**
 * Create api client
 *
 * @param apiName Short name to use in debug logs
 * @param baseUrl Either relativ eor absolute, it must end without trailing slash
 */
export const createApi = <TEndpoints extends Koine.Api.Endpoints>(
  apiName: string,
  baseUrl: string,
  options?: Koine.Api.ClientOptions
) => {
  const {
    transformRequest: transformRequestBase,
    transformResponse: transformResponseBase,
    request: requestBase = {
      credentials: "include",
      referrerPolicy: "no-referrer",
      // mode: "cors",
      // redirect: "follow",
      // cache: "no-cache",
    },
    shouldThrow: shouldThrowBase,
  } = options || {};

  return (
    ["get", "post", "put", "patch", "delete"] as Koine.Api.RequestMethod[]
  ).reduce(
    <TMethod extends Koine.Api.RequestMethod>(
      api: Koine.Api.Client<TEndpoints>,
      method: TMethod
    ) => {
      api[method] = async <
        TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>,
        TOptions extends Koine.Api.EndpointRequestOptions<
          TEndpoints,
          TEndpoint,
          TMethod
        >,
        TResponseOk extends Koine.Api.ResponseOk = Koine.Api.EndpointResponseOk<
          TEndpoints,
          TEndpoint,
          TMethod
        >,
        TResponseFail extends Koine.Api.ResponseFail = Koine.Api.EndpointResponseFail<
          TEndpoints,
          TEndpoint,
          TMethod
        >
      >(
        endpoint: TEndpoint,
        options?: TOptions
      ) => {
        const {
          json,
          path,
          params,
          request = requestBase,
          headers = {},
          timeout = 10000,
          transformRequest = transformRequestBase,
          transformResponse = transformResponseBase,
          shouldThrow = shouldThrowBase,
        } = options || {};

        let requestInit: RequestInit = {
          method: method.toUpperCase(),
          ...request,
          headers: {
            "content-type": "application/json",
            ...headers,
          },
        };

        if (path && Object.keys(path).length) {
          for (const key in path) {
            endpoint = endpoint.replace(
              `{${key}}`,
              path[key].toString()
            ) as TEndpoint;
          }
        }

        const timeoutNumber = Number(timeout);
        let controller: AbortController;
        let timeoutId;
        let url = `${baseUrl}/${endpoint + "".replace(/^\/*/, "")}`;

        if (method !== "get" && json) {
          requestInit.body = JSON.stringify(json);
        }
        if (timeoutNumber > 0) {
          controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), timeoutNumber);
          requestInit.signal = controller.signal;
        }

        if (transformRequest) {
          requestInit = transformRequest(requestInit);
        }

        if (params) {
          // FIXME: ts-expect-error this assertion is not the best, but nevermind for now
          // url += buildUrlQueryString(params as unknown as Koine.Api.RequestParams);
          url += buildUrlQueryString(
            params as unknown as Koine.Api.RequestParams
          );
        }

        let response: Response;

        if (shouldThrow) {
          try {
            response = await fetch(url, requestInit);
          } catch (e) {
            // eslint-disable-next-line no-throw-literal
            throw { e };
          }
        } else {
          response = await fetch(url, requestInit);
        }

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        let result: Koine.Api.Result<TResponseOk, TResponseFail>;

        if (shouldThrow) {
          try {
            if (transformResponse) {
              result = await transformResponse<TResponseOk, TResponseFail>(
                response,
                options || {}
              );
            } else {
              result = await response.json();
            }
          } catch (e) {
            // eslint-disable-next-line no-throw-literal
            throw { e };
          }
        } else {
          if (transformResponse) {
            result = await transformResponse<TResponseOk, TResponseFail>(
              response,
              options || {}
            );
          } else {
            result = await response.json();
          }
        }

        if (shouldThrow && result.fail) {
          // throw new ApiError<Failed>(result);
          // I prefer to throw an object literal despite what eslint says
          // eslint-disable-next-line no-throw-literal
          throw result;
        }

        if (process.env["NODE_ENV"] !== "production") {
          const msg = `${
            result.status
          }: api[${apiName}] ${method.toUpperCase()} ${url}`;
          if (result.ok) {
            console.log(`[@koine] 🟢 ${msg}`);
          } else {
            console.log(`[@koine] 🔴 ${msg}`);
          }
        }
        return result;
      };
      return api;
    },
    {} as Koine.Api.Client<TEndpoints>
  );
};
