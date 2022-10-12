import { debounce as tsDebounce } from "ts-debounce";

export { type Options as DebounceOptions } from "ts-debounce";
export { type DebouncedFunction } from "ts-debounce";

/**
 * Debounce function (with `Promise`)
 *
 * @category function
 * @borrows [chodorowicz/ts-debounce](https://github.com/chodorowicz/ts-debounce)
 */
export const debouncePromise = tsDebounce;

export default debouncePromise;
