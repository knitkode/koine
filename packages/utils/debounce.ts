import { debounce as tsDebounce } from "ts-debounce";

export { type Options as DebounceOptions } from "ts-debounce";
export { type DebouncedFunction } from "ts-debounce";

/**
 * Debounce function
 *
 * @category function
 * @borrows [chodorowicz/ts-debounce](https://github.com/chodorowicz/ts-debounce)
 */
export const debounce = tsDebounce;

export default debounce;
