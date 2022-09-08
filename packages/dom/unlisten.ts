import {
  type EventCallback,
  activeEvents,
  getIndex,
  eventHandler,
} from "./_listen-delegation";
import { off } from "./off";

/**
 * Stop listening for an event
 *
 * @category listen-delegation
 *
 * @param types The event type or types (comma separated)
 * @param selector The selector to remove the event from
 * @param callback The function to remove
 */
export function unlisten(
  types: string,
  selector: string,
  callback: EventCallback
) {
  // Loop through each event type
  types.split(",").forEach(function (type) {
    // Remove whitespace
    type = type.trim();

    // if event type doesn't exist, bail
    if (!activeEvents[type]) return;

    // If it's the last event of it's type, remove entirely
    if (activeEvents[type].length < 2 || !selector) {
      delete activeEvents[type];
      off(window, type, eventHandler, true);
      return;
    }

    // Otherwise, remove event
    const index = getIndex(activeEvents[type], selector, callback);
    if (index < 0) return;
    activeEvents[type].splice(index, 1);
  });
}

export default unlisten;
