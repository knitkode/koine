import isUndefined from "./isUndefined";

/**
 * @category ssr
 * @category is
 */
export const isServerNow = () => isUndefined(window);

export default isServerNow;
