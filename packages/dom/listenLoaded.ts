import { on } from "./on";

/**
 * Fires a callback when the DOM content is loaded
 *
 * @see https://mathiasbynens.be/notes/settimeout-onload
 */
export function listenLoaded(handler: (event: Event) => any) {
  on(document, "DOMContentLoaded", handler);
  // document.addEventListener("DOMContentLoaded", setTimeout(handler, 4));
}

export default listenLoaded;
