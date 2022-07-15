import { buildUrlQueryString, isFullObject } from "@koine/utils";

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
    headers: headersBase = {},
    request: requestBase = {
      credentials: "include",
      referrerPolicy: "no-referrer",
      // mode: "cors",
      // redirect: "follow",
      // cache: "no-cache",
    },
    exception: exceptionBase,
    timeout: timeoutBase = 10000,
    processReq: processReqBase,
    processRes: processResBase,
  } = options || {};

  return (
    ["get", "post", "put", "patch", "delete"] as Koine.Api.RequestMethod[]
  ).reduce(
    <TMethod extends Koine.Api.RequestMethod>(
      api: Koine.Api.Client<TEndpoints>,
      method: TMethod
    ) => {
      // @ts-expect-error FIXME: type
      api[method] = async <
        TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>,
        TOptions extends Koine.Api.EndpointOptions<
          TEndpoints,
          TEndpoint,
          TMethod
        > = Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
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
          request = requestBase,
          headers = headersBase,
          timeout = timeoutBase,
          processReq = processReqBase,
          processRes = processResBase,
          exception = exceptionBase,
        } = options || {};
        let { params, json, query } = options || {};

        let url = `${baseUrl}/${endpoint + "".replace(/^\/*/, "")}`;
        let requestInit: RequestInit = {
          method: method.toUpperCase(),
          ...request,
          headers: {
            "content-type": "application/json",
            ...headers,
          },
        };

        if (processReq) {
          const transformed = processReq(
            method,
            url,
            query,
            json,
            params,
            requestInit
          );
          url = transformed[0];
          query = transformed[1] as typeof query;
          json = transformed[2] as typeof json;
          params = transformed[3] as typeof params;
          requestInit = transformed[4];
        }

        if (isFullObject(params)) {
          for (const key in params) {
            url = url.replace(`{${key}}`, params[key].toString());
          }
        }

        const timeoutNumber = Number(timeout);
        let controller: AbortController;
        let timeoutId;

        if (method !== "get" && json) {
          requestInit.body = JSON.stringify(json);
        }
        if (timeoutNumber > 0) {
          controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), timeoutNumber);
          requestInit.signal = controller.signal;
        }

        if (query) {
          // FIXME: ts-expect-error this assertion is not the best, but nevermind for now
          url += buildUrlQueryString(
            query as unknown as Koine.Api.RequestQuery
          );
        }

        let response: Response;

        if (exception) {
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

        if (exception) {
          try {
            if (processRes) {
              result = await processRes<TResponseOk, TResponseFail>(
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
          if (processRes) {
            result = await processRes<TResponseOk, TResponseFail>(
              response,
              options || {}
            );
          } else {
            result = await response.json();
          }
        }

        if (exception && result.fail) {
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
            console.log(`🟢 ${msg}`);
          } else {
            console.log(`🔴 ${msg}`);
          }
        }
        return result;
      };
      return api;
    },
    {} as Koine.Api.Client<TEndpoints>
  );
};

export default createApi;
