import { on } from "./on";
import { off } from "./off";

/**
 * Native `scrollTo`, `"smooth"` and with callback
 *
 * @borrows https://stackoverflow.com/a/55686711/1938970
 *
 * @param offset - offset to scroll to
 * @param callback - callback function
 */
export function scrollTo(offset: number, callback?: () => void) {
  const fixedOffset = offset.toFixed();

  if (callback) {
    const onScroll = function () {
      if (window.pageYOffset.toFixed() === fixedOffset) {
        off(window, "scroll", onScroll);
        callback();
      }
    };

    on(window, "scroll", onScroll);
    onScroll();
  }

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}
export default scrollTo;
