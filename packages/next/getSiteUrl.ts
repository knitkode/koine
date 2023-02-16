import normaliseUrl from "@koine/utils/normaliseUrl";

/**
 * Get site absolute url with the given path
 *
 * - It uses the `NEXT_PUBLIC_APP_URL` env variable
 * - It removes the trailing slashes
 */
export function getSiteUrl(path = "") {
  return normaliseUrl(`${process.env["NEXT_PUBLIC_APP_URL"]}/${path}`);
}

export default getSiteUrl;
