import getType from "./getType";

/**
 * Returns whether the payload is a Blob
 *
 * @category is
 */
export function isBlob(payload: any): payload is Blob {
  return getType(payload) === "Blob";
}

export default isBlob;
