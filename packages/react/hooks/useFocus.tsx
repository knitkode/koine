import { useRef } from "react";

/**
 * @see https://stackoverflow.com/a/54159564/1938970
 */
export const useFocus = () => {
  const element = useRef<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(null);
  const setFocus = () => {
    element.current && element.current.focus();
  };

  return [element, setFocus];
};
