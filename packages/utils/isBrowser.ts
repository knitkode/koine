// import { isUndefined } from "./is";

/**
 * @category ssr
 * @category is
 */
export const isBrowser = typeof window !== "undefined";
// export const isBrowser = () => !isUndefined(window);

export default isBrowser;
