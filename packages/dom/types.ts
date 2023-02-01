import type { AnythingFalsy } from "@koine/utils/types";

export type AnyDOMEventTarget = Window | Document | HTMLElement | Element;

/**
 * We use it either throwing an error on unexisting element or falling back
 * to `window` in case of _scroll_ or _resize_ events
 */
export type AnyDOMEventTargetLoose = AnyDOMEventTarget | AnythingFalsy;
