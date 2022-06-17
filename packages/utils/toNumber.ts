import { isNumber } from "./isNumber";

/**
 * @category cast
 */
export function toNumber(input?: string | number, fallback?: number) {
  return isNumber(input) ? input : input ? parseFloat(input) : fallback || 0;
}

export default toNumber;
