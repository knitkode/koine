/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/misc/types.ts)
 */
export type PromiseType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : never;

/**
 * @borrows [streamich/react-use](https://github.com/streamich/react-use/blob/master/src/misc/types.ts)
 */
export type FunctionReturningPromise = (...args: any[]) => Promise<any>;
