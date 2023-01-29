import { useEffect, useState } from "react";
import { on } from "@koine/dom";

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    const listener = on(window, "resize", updateSize);
    updateSize();
    return listener;
  }, []);
  return size;
}

export default useWindowSize;
