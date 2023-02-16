/**
 * Listen: events delegation system
 *
 * From:
 * https://github.com/cferdinandi/events
 * https://github.com/cferdinandi/events/blob/master/src/js/events/events.js
 *
 * @fileoverview
 */
import isString from "@koine/utils/isString";
import escapeSelector from "./escapeSelector";

/**
 * @internal
 */
export type EventCallback = (
  event: Event,
  desiredTarget: Window | Document | Element
) => any;

/**
 * @internal
 */
export type ListenEvent = {
  selector: string;
  callback: EventCallback;
};

/**
 * Active events
 *
 * @internal
 */
export const activeEvents: Record<Event["type"], ListenEvent[]> = {};

/**
 * Get the index for the listener
 *
 * @internal
 */
export function getIndex(
  arr: ListenEvent[],
  selector: string,
  callback: EventCallback
) {
  for (let i = 0; i < arr.length; i++) {
    if (
      arr[i].selector === selector &&
      arr[i].callback.toString() === callback.toString()
    )
      return i;
  }
  return -1;
}

/**
 * Check if the listener callback should run or not
 *
 * @internal
 * @param target The event.target
 * @param selector The selector/element to check the target against
 * @return If not false, run listener and pass the targeted element to use in the callback
 */
export function getRunTarget(
  target: Element,
  selector: string | Window | Document | Element
) {
  // @ts-expect-error FIXME: type
  if (["*", "window", window].includes(selector)) {
    return window;
  }
  if (
    [
      "document",
      "document.documentElement",
      document,
      document.documentElement,
      // @ts-expect-error FIXME: type
    ].includes(selector)
  )
    return document;

  if (isString(selector)) {
    return target.closest(escapeSelector(selector));
  }

  // @ts-expect-error FIXME: type
  if (typeof selector !== "string" && selector.contains) {
    if (selector === target) {
      return target;
    }
    // @ts-expect-error FIXME: type
    if (selector.contains(target)) {
      return selector;
    }
    return false;
  }

  return false;
}

/**
 * Handle listeners after event fires
 *
 * @internal
 */
export function eventHandler(event: Event) {
  if (!activeEvents[event.type]) return;
  activeEvents[event.type].forEach(function (listener) {
    const target = getRunTarget(event.target as Element, listener.selector);
    if (!target) {
      return;
    }
    listener.callback(event, target);
  });
}
