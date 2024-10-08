import { useEffect, useRef } from "react";

export let usePreviousRef = <T extends unknown>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePreviousRef;
