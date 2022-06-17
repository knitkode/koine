import useSWR, {
  type SWRConfiguration,
  type SWRResponse,
  // type Fetcher,
} from "swr";
import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from "swr/mutation";
import { createApi } from "../core";

type KoineApiMethodHookSWR<
  THookName extends keyof Koine.Api.HooksMapsByName,
  TEndpoints extends Koine.Api.Endpoints
> = <
  TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>,
  TMethod extends Koine.Api.RequestMethod = Koine.Api.HooksMapsByName[THookName]
>(
  endpoint: TEndpoint,
  options?: Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>,
  config?: THookName extends "useGet"
    ? SWRConfiguration<
        Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
        Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>
      >
    : SWRMutationConfiguration<
        Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
        Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
        Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>,
        TEndpoint
      >
) => THookName extends "useGet"
  ? SWRResponse<
      Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>
    >
  : SWRMutationResponse<
      Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>,
      TEndpoint
    >;

function createUseApi<
  TEndpoints extends Koine.Api.Endpoints,
  TMethod extends Koine.Api.RequestMethod
>(api: Koine.Api.Client<TEndpoints>, method: TMethod) {
  return function useApi<TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>>(
    endpoint: TEndpoint,
    options?: Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>,
    _config?: unknown
  ) {
    if (method === "get") {
      // const fetcher = async (_endpoint: TEndpoint) => {
      //   try {
      //     const { ok, data } = await api[method](_endpoint, {
      //         ...(options || {}),
      //         shouldThrow: true,
      //       });
      //       if (ok) {
      //         return data;
      //       }
      //       throw new Error() as unknown as Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>;
      //     } catch(e) {
      //       throw new Error() as unknown as Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>;;
      //     }
      //   };
      // }

      const fetcher = async () => {
        const { data } = await api[method](endpoint, {
          ...(options || {}),
          shouldThrow: true,
        });
        return data as Koine.Api.EndpointResponseOk<
          TEndpoints,
          TEndpoint,
          TMethod
        >;
      };
      const config = _config as SWRConfiguration<
        Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>
        // Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>
      >;

      // <Data = any, Error = any>(key: Key, config: SWRConfiguration<Data, Error, Fetcher<Data>> | undefined): SWRResponse<Data, Error>;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSWR<
        Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
        Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>
      >(options ? [endpoint, options] : [endpoint], fetcher, config);
    }

    const config = _config as SWRMutationConfiguration<
      Koine.Api.EndpointResultOk<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointResultFail<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>,
      TEndpoint
    >;

    const sender = async (
      // if the first argument is an array the second tem are the base options
      // defined when calling the usePost/Put/etc. hook, these will be overriden
      // by the _options just here below
      _endpoint:
        | [
            TEndpoint,
            Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>
          ]
        | TEndpoint,
      // these are the options arriving when calling `trigger({ json, params, etc... })
      _options: Readonly<{
        arg: Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>;
      }>
    ) => {
      const endpoint = Array.isArray(_endpoint) ? _endpoint[0] : _endpoint;
      const options = Array.isArray(_endpoint) ? _endpoint[1] : {};
      const { ok, data } = await api[method](endpoint, {
        ...options,
        ...(_options.arg || {}),
        shouldThrow: true,
      });
      return ok ? data : data;
    };

    // config.fetcher = sender;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWRMutation<
      Koine.Api.EndpointResultOk<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointResultFail<TEndpoints, TEndpoint, TMethod>,
      TEndpoint,
      Koine.Api.EndpointRequestOptions<TEndpoints, TEndpoint, TMethod>
    >(
      // @ts-expect-error FIXME: I can't get it...
      options ? [endpoint, options] : endpoint,
      sender,
      config
    );
  };
}

/**
 * It creates an api client extended with auto-generated SWR wrapper hooks
 */
export const createSwrApi = <TEndpoints extends Koine.Api.Endpoints>(
  ...args: Parameters<typeof createApi>
) => {
  const api = createApi<TEndpoints>(...args) as Koine.Api.Client<TEndpoints> & {
    [HookName in keyof Koine.Api.HooksMapsByName]: KoineApiMethodHookSWR<
      HookName,
      TEndpoints
    >;
  };

  (["get", "post", "put", "patch", "delete"] as const).forEach(
    <TMethod extends Koine.Api.RequestMethod>(method: TMethod) => {
      const hookName = `use${
        method.charAt(0).toUpperCase() + method.slice(1)
      }` as keyof Koine.Api.HooksMapsByName;
      api[hookName] = createUseApi<TEndpoints, TMethod>(
        api,
        method
      ) as KoineApiMethodHookSWR<typeof hookName, TEndpoints>;
    }
  );

  return api;
};
