/**
 * Copy pasted from [chodorowicz/ts-debounce](https://github.com/chodorowicz/ts-debounce/blob/master/src/index.ts)
 *
 * @module
 *
 * TODO: check and maybe use [unjs implementation](https://github.com/unjs/perfect-debounce)
 */

/**
 * @categroy functionn
 */
export type DebounceOptions<Result> = {
  isImmediate?: boolean;
  maxWait?: number;
  callback?: (data: Result) => void;
};

/**
 * @category functionn
 */
export interface DebouncedFunction<
  Args extends any[],
  F extends (...args: Args) => any,
> {
  (
    this: ThisParameterType<F>,
    ...args: Args & Parameters<F>
  ): Promise<ReturnType<F>>;
  cancel: (reason?: any) => void;
}

interface DebouncedPromise<FunctionReturn> {
  resolve: (result: FunctionReturn) => void;
  reject: (reason?: any) => void;
}

/**
 * Debounce function (with `Promise`)
 *
 * @category function
 * @borrows [chodorowicz/ts-debounce](https://github.com/chodorowicz/ts-debounce)
 */
export let debouncePromise = <
  Args extends any[],
  F extends (...args: Args) => any,
>(
  func: F,
  waitMilliseconds = 50,
  options: DebounceOptions<ReturnType<F>> = {},
): DebouncedFunction<Args, F> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options.isImmediate ?? false;
  const callback = options.callback ?? false;
  const maxWait = options.maxWait;
  let lastInvokeTime = Date.now();

  let promises: DebouncedPromise<ReturnType<F>>[] = [];

  function nextInvokeTimeout() {
    if (maxWait !== undefined) {
      const timeSinceLastInvocation = Date.now() - lastInvokeTime;

      if (timeSinceLastInvocation + waitMilliseconds >= maxWait) {
        return maxWait - timeSinceLastInvocation;
      }
    }

    return waitMilliseconds;
  }

  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ) {
    const context = this;
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = function () {
        timeoutId = undefined;
        lastInvokeTime = Date.now();
        if (!isImmediate) {
          const result = func.apply(context, args);
          callback && callback(result);
          promises.forEach(({ resolve }) => resolve(result));
          promises = [];
        }
      };

      const shouldCallNow = isImmediate && timeoutId === undefined;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeTimeout());

      if (shouldCallNow) {
        const result = func.apply(context, args);
        callback && callback(result);
        return resolve(result);
      }
      promises.push({ resolve, reject });
    });
  };

  debouncedFunction.cancel = function (reason?: any) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    promises.forEach(({ reject }) => reject(reason));
    promises = [];
  };

  return debouncedFunction;
};

export default debouncePromise;
