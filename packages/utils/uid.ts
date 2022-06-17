let lastId = 0;

/**
 * Super basic UID increment-based generator
 *
 * @category uid
 */
export const uid = (prefix = "id") => {
  lastId++;
  return `${prefix}-${lastId}`;
};

export default uid;
