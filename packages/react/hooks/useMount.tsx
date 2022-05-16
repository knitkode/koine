import { useEffectOnce } from "./useEffectOnce";

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/useMount.ts)
 */
export const useMount = (fn: () => void) => {
  useEffectOnce(() => {
    fn();
  });
};
