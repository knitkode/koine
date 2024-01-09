export type Translate = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18nKey: any,
  // i18nKey: string | TemplateStringsArray,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any,
  // query?: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any,
  // options?: {
  //   returnObjects?: boolean;
  //   fallback?: string | string[];
  //   default?: string;
  // }
) => string;

export type Option = {
  value: string;
  Label?: NonNullable<import("react").ReactNode>;
  label: NonNullable<
    import("react").ReactChild | import("react").ReactFragment
  >;
};

export type KoineComponentProps<BaseComponentProps, ExtendableProps> =
  BaseComponentProps & ExtendableProps;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KoineComponent<Props = any> =
  | string
  | React.ForwardRefExoticComponent<Props>
  | React.ExoticComponent<Props>
  | React.FC<Props>
  | ((props: Props) => JSX.Element);

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
