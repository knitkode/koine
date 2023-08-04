/// <reference types="./typings.d.ts" />

export const createApiResultFail = <T>(
  data: T = {} as T,
  msg?: string,
  status?: number,
): Koine.Api.ResultFail<T> => ({
  fail: true,
  data,
  msg: msg || "",
  status: status || 404,
});

export default createApiResultFail;
