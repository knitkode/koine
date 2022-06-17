/**
 * Returns whether the payload is ''
 *
 * @category is
 */
export function isEmptyString(payload: any): payload is string {
  return payload === "";
}

export default isEmptyString;
