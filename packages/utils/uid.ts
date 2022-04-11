let lastId = 0;

/**
 * Super basic UID increment-based generator
 */
export const uid = (prefix = "id") => {
  lastId++;
  return `${prefix}-${lastId}`;
};

/**
 * Uuid, tiny custom helper instead of node's uuid/v4
 *
 * @see https://stackoverflow.com/a/2117523/1938970
 */
export const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
