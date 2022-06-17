import getType from "./getType";

/**
 * Returns whether the payload is an Error
 *
 * @category is
 */
export function isError(payload: any): payload is Error {
  return getType(payload) === "Error";
}

export default isError;
