import { useEffect, useRef } from "react";

export function usePreviousRef<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePreviousRef;
