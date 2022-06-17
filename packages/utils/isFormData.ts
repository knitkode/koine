import getType from "./getType";

/**
 * Returns whether the payload is a FormData
 *
 * @category is
 */
export function isFormData(payload: any): payload is FormData {
  return getType(payload) === "FormData";
}

export default isFormData;
