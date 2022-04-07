import { normaliseUrl } from "@koine/utils";

export * from "./api";
export * from "./emotion";

export const ONE_HOUR = 3600;

export const ONE_DAY = 84000;

/**
 * Get site absolute url with the given path
 *
 * - It uses the `NEXT_PUBLIC_APP_URL` env variable
 * - It removes the trailing slashes
 */
export function getSiteUrl(path = "") {
  return normaliseUrl(`${process.env["NEXT_PUBLIC_APP_URL"]}/${path}`);
}

/**
 * Utility to load a component with an optional pre-determined delay.
 *
 * This was designed to improve anti spam wit async form loading.
 *
 * @see https://github.com/vercel/next.js/blob/main/packages/next/next-server/lib/dynamic.tsx
 * @see https://github.com/vercel/next.js/blob/canary/examples/with-dynamic-import/pages/index.js
 */
export function load<T>(component: T, milliseconds: number) {
  return new Promise<typeof component>((resolve) => {
    setTimeout(() => resolve(component), milliseconds);
  });
}
