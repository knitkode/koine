import {
  type EventCallback,
  activeEvents,
  eventHandler,
} from "./_listen-delegation";
import { on } from "./on";
import { off } from "./off";

/**
 * Listen an event
 *
 * @category listen-delegation
 *
 * @param types The event type or types (comma separated)
 * @param selector The selector to run the event on
 * @param callback The function to run when the event fires
 */
export function listen(
  types: string,
  selector: string,
  callback: EventCallback
) {
  // Make sure there's a selector and callback
  if (!selector || !callback) return;

  // Loop through each event type
  types.split(",").forEach(function (type) {
    // Remove whitespace
    type = type.trim();

    // If no event of this type yet, setup
    if (!activeEvents[type]) {
      activeEvents[type] = [];
      on(window, type, eventHandler, true);
    }

    // Push to active events
    activeEvents[type].push({
      selector: selector,
      callback: callback,
    });
  });
}

export default listen;
