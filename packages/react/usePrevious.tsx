import { useState } from "react";

/**
 * @borrows [samselikoff/animated-carousel](https://github.com/samselikoff/2022-06-02-animated-carousel/blob/main/pages/final.jsx)
 */
export function usePrevious<T>(state: T, defaulValue: T) {
  const [tuple, setTuple] = useState([state, defaulValue]);
  if (tuple[1] !== state) {
    setTuple([tuple[1], state]);
  }

  return tuple[0];
}

export default usePrevious;
