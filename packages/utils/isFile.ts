import getType from "./getType";

/**
 * Returns whether the payload is a File
 *
 * @category is
 */
export function isFile(payload: any): payload is File {
  return getType(payload) === "File";
}

export default isFile;
