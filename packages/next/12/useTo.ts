"use client";

import { type ToArgs, to } from "./to";
import { useT } from "./useT";

export function useTo() {
  const t = useT("~");
  return (...args: ToArgs) => to(t, ...args);
}

export default useTo;
