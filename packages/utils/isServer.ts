import isBrowser from "./isBrowser";

/**
 * @category ssr
 * @category is
 */
export const isServer = !isBrowser;
// export const isServer = () => !isUndefined(window);

export default isServer;
