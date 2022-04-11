import { isNumber } from "./is";

export function toNumber(input?: string | number, fallback?: number) {
  return isNumber(input) ? input : input ? parseFloat(input) : fallback || 0;
}

/**
 * Ensure input to be an integer
 */
export const ensureInt = (input: string | number) =>
  typeof input === "string" ? parseInt(input, 10) : Math.round(input);
