/// <reference types="./typings.d.ts" />

/**
 * Custom `ApiError` class extending `Error` to throw in failed response.
 *
 * @see https://eslint.org/docs/rules/no-throw-literal
 * @see https://github.com/sindresorhus/ky/blob/main/source/errors/HTTPError.ts
 *
 */
export class ApiError<
  TResponseFail extends Koine.Api.ResponseFail = unknown,
> extends Error {
  constructor(result: Koine.Api.ResultFail<TResponseFail>) {
    super(`Request failed with ${result.status} ${result.msg}`);
    this.name = "ApiError";
    Object.assign(this, result);
  }
}

export default ApiError;
