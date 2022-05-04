// import { isUndefined } from "./is.js";

export const isBrowser = typeof window !== "undefined";
// export const isBrowser = () => !isUndefined(window);

export const isServer = !isBrowser;
// export const isServer = () => isUndefined(window);
