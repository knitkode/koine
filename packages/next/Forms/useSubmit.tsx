import type { UnpackNestedValue } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { api, KoineApi } from "../utils/api";

export function useSubmit<
  RequestBody extends {},
  ResponseSuccesfull extends KoineApi.ResponseSuccesfull = {},
  // ResponseFailed extends KoineApi.ResponseFailed = {},
  // `Record<keyof RequestBody, string[]>` is the standard validation error from laravel
  ResponseFailed extends KoineApi.ResponseFailed = Record<
    keyof RequestBody,
    string | string[]
  >
>(url: string, transformData?: (json: UnpackNestedValue<RequestBody>) => any) {
  const [state, submit] = useAsyncFn(
    async (json) => {
      if (transformData) json = transformData(json);
      const response = await api.post<ResponseSuccesfull, ResponseFailed>(url, {
        json,
      });
      if (process.env["NODE_ENV"] !== "production") {
        console.log("[@koine/next] useSubmit response", response);
      }
      return response;
    },
    [url, transformData]
  );

  const { loading, error, value } = state;
  const fail = !loading && (!!error || value?.fail);
  return {
    submit,
    loading,
    ...(value || {}),
    fail,
  } as KoineApi.ResponseShared<{
    submit: typeof submit;
    loading: typeof loading;
  }> &
    (
      | {
          ok?: boolean;
          fail?: boolean;
          loading: true;
          data?: undefined;
        }
      | {
          ok: true;
          fail?: false;
          loading?: false;
          data: ResponseSuccesfull;
        }
      | {
          ok?: false;
          fail: true;
          loading?: false;
          data: ResponseFailed;
        }
    );
}
