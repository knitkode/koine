"use client";

import { useT } from "./useT";
import { to, type ToArgs } from "./to";

export function useTo() {
  const t = useT("~");
  return (...args: ToArgs) => to(t, ...args);
}

export default useTo;
