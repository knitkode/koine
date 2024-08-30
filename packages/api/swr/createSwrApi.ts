"use client";

import useSWR, {
  type BareFetcher,
  type SWRConfiguration,
  type SWRResponse,
} from "swr";
import { isFunction } from "@koine/utils";
import { createApi } from "../createApi";
import type { Api } from "../types";

export namespace ApiSWR {
  export type ConfigurationExtended<
    Data = any,
    Error = any,
    Fn extends BareFetcher<any> = BareFetcher<any>,
  > = SWRConfiguration<Data, Error, Fn> & {
    /**
     * Conditional fetching as option
     *
     * Moving this to an option allows us to keep the endpoints typed dictionary,
     * e.g. we can write:
     *
     * ```js
     * const { data, mutate } = myApi.use("User/{id}",
     *  { params: { id: aVariableMaybeContainingAnId || "" }, },
     *  { when: !!aVariableMaybeContainingAnId }
     * );
     *
     * // we still have typed `data`, `mutate`
     * ```
     * @see https://swr.vercel.app/docs/conditional-fetching
     */
    when?: boolean | (() => boolean);
  };

  /**
   * The `api` interface generated by `createApi`
   */
  export type Client<TEndpoints extends Api.Endpoints> =
    Api.Client<TEndpoints> & {
      use: ReturnType<typeof createUseApi<TEndpoints>>;
      // use: <TEndpoint extends Api.EndpointUrl<TEndpoints>>(
      //   endpoint: TEndpoint,
      //   options?: Api.EndpointOptions<TEndpoints, TEndpoint, "get">,
      //   swrConfig?: ConfigurationExtended<
      //     Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      //     Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
      //   >,
      // ) => SWRResponse<
      //   Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      //   Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
      // >;
    };
}

/**
 * @private
 */
export let createUseApi =
  <TEndpoints extends Api.Endpoints>(
    api: Api.Client<TEndpoints>,
    defaultSwrConfig?: ApiSWR.ConfigurationExtended,
  ) =>
  /**
   * Api SWR wrapped hook
   *
   * @param endpoint Endpoint URL string
   * @param options {@link Api.EndpointOptions API endpoint options}
   * @param swrConfig {@link ApiSWR.ConfigurationExtended Extended SWR configuration}
   */
  <TEndpoint extends Api.EndpointUrl<TEndpoints>>(
    endpoint: TEndpoint,
    options?: Api.EndpointOptions<TEndpoints, TEndpoint, "get">,
    swrConfig?: ApiSWR.ConfigurationExtended<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
    >,
  ) => {
    const swrConfigResolved = {
      ...(defaultSwrConfig || {}),
      ...(swrConfig || {}),
    };
    const fetcher = async () => {
      const { data } = await api.get(endpoint, {
        ...(options || {}),
        throwErr: true,
      });
      return data as Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">;
    };

    const shouldNotFetch =
      swrConfigResolved?.when === false ||
      (isFunction(swrConfigResolved?.when) &&
        swrConfigResolved?.when() === false);

    return useSWR<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
    >(
      shouldNotFetch ? null : options ? [endpoint, options] : [endpoint],
      fetcher,
      swrConfigResolved,
    ) as SWRResponse<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
    >;
  };

/**
 * It creates an api client extended with auto-generated SWR wrapper hooks
 *
 * @param apiName Short name to use in debug logs
 * @param baseUrl Either relative or absolute, it must end without trailing slash
 */
export let createSwrApi = <TEndpoints extends Api.Endpoints>(
  apiName: string,
  baseUrl: string,
  defaultOptions?: Api.ClientOptions,
  defaultSwrConfig?: ApiSWR.ConfigurationExtended,
  // ...args: Parameters<typeof createApi>
) => {
  const api = createApi<TEndpoints>(
    apiName,
    baseUrl,
    defaultOptions,
  ) as ApiSWR.Client<TEndpoints>;

  api.use = createUseApi<TEndpoints>(api, defaultSwrConfig);

  return api;
};

export default createSwrApi;
