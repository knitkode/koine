export const createApiResultOk = <T>(
  data: T = {} as T,
  msg?: string
): Koine.Api.ResultOk<T> => ({
  ok: true,
  fail: false,
  data,
  msg: msg || "",
  status: 200,
});

export default createApiResultOk;
