import isUndefined from "./isUndefined";

/**
 * @category ssr
 * @category is
 */
export const isBrowserNow = () => !isUndefined(window);

export default isBrowserNow;
