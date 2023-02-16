import isBrowser from "@koine/utils/isBrowser";
import useHeader from "../Header/useHeader";

export function useScrollTo(id = "", offset = 0) {
  const [, , headerHeight] = useHeader();
  if (!isBrowser) {
    return;
  }
  const headerOffset = headerHeight || 0;
  let element = document.getElementById(id);
  let top = 0;

  if (element && element.offsetParent) {
    do {
      top += element.offsetTop;
    } while ((element = element.offsetParent as HTMLElement));
  }

  top -= offset;
  top -= headerOffset;

  window.scroll(0, top);
}

export default useScrollTo;
