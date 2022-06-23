import isBrowser from "./isBrowser";

/**
 * @category ssr
 * @category is
 */
export const isServer = !isBrowser;
// export const isServer = typeof window === "undefined";
// export const isServer = () => typeof window === "undefined";

export default isServer;
