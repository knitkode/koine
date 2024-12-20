import { type EventCallback, getRunTarget } from "./_listen-delegation";
import { listen } from "./listen";
import type { AnyWindowEventType } from "./types";
import { unlisten } from "./unlisten";

/**
 * Listen an event, and automatically unlisten it after it's first run
 *
 * @category listen-delegation
 *
 * @param types The event type or types (comma separated)
 * @param selector The selector to run the event on
 * @param callback The function to run when the event fires
 */
export let listenOnce = (
  types: string,
  selector: string,
  callback: EventCallback,
) =>
  listen(types as AnyWindowEventType, selector, function temp(event) {
    const target = getRunTarget(event.target as HTMLElement, selector);
    callback(event, target || window);
    unlisten(types as AnyWindowEventType, selector, temp);
  });

export default listenOnce;
