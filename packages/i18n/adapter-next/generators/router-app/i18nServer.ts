import { createGenerator } from "../../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    options: {
      routes: { localeParamName },
      adapter: { meta: { nextVersion }}
    },
  } = arg;

  const maybeWrapInPromise = (code: string) => nextVersion >= 15 ? `Promise<${code}>` : code;

  return {
    i18nServerHelpers: {
      dir: createGenerator.dirs.server,
      name: "i18nServerHelpers",
      ext: "ts",
      index: false,
      content: () => /* j s */ `
import { notFound } from "next/navigation";
import type { Simplify } from "@koine/utils";
import type { I18n } from "../types";
import { isLocale } from "../isLocale";
import { getLocale } from "./getLocale";
import { setLocale } from "./setLocale";

/**
 * Params available from the URL/folder structure \`/[${localeParamName}]/my-route/page.tsx\`,
 * named accordingly to the \`localeParam\` option.
 */
type I18nParams = {
  "${localeParamName}": I18n.Locale;
};

export type I18nNextPropsLayout = {
  params?: SegmentParams | Promise<SegmentParams>;
};

export type I18nNextPropsPage = {
  params?: SegmentParams | Promise<SegmentParams>;
  searchParams?: any;
};

type I18nNextProps = I18nNextPropsPage | I18nNextPropsLayout;

type SegmentParams = Partial<Record<string, string | string[]>>;

/**
 * Adjust props for next's typechecking
 *
 * From version _15_ on params are a \`Promise\`, we enforce this constraint
 * dynamically at compile time to our {@link I18nNextProps more flexible type \`I18nNextProps\`}.
 */
export type NextProps<P> = Omit<P, "params"> &
  (P extends { params?: Promise<infer T> }
    ? { params: ${maybeWrapInPromise("Simplify<Omit<T, keyof I18nParams>>")} }
    : P extends { params?: infer T }
      ? { params: ${maybeWrapInPromise("Simplify<Omit<T, keyof I18nParams>>")} }
      : { params?: ${maybeWrapInPromise("{}")} });

export type UnwrapParamsPromise<P> = Omit<P, "params"> &
  (P extends { params?: Promise<infer T> }
    ? { params: Simplify<Omit<T, keyof I18nParams>> }
    : P extends { params?: infer T }
      ? { params: Simplify<Omit<T, keyof I18nParams>> }
      : { params?: {} });

type ResolvedProps<P extends I18nNextProps> = UnwrapParamsPromise<P> & {
  /**
   * Current requested locale derived from the URL/folder structure, e.g.:
   * \`/[${localeParamName}]/my-route/page.tsx\`, named accordingly to the
   * \`localeParam\` option.
   */
  locale: I18n.Locale;
};

type ExtraConfig<TConfigurator, TConfig> = TConfigurator extends
  | ((...args: any) => infer TExtra | Promise<infer TExtra>)
  | infer TExtra
  ? Omit<TExtra, "namespaces"> // keyof TConfig>
  : {};

type I18nServerConfig = { locale?: I18n.Locale };

export type I18nServerConfigurator<Config, Props extends I18nNextProps> =
  | ((props: ResolvedProps<Props>) => Config | Promise<Config>)
  | Config;

export type I18nProps<
  TProps extends I18nNextProps,
  TConfig extends I18nServerConfig,
  TConfigurator extends I18nServerConfigurator<TConfig, TProps>,
> = ResolvedProps<TProps> & ExtraConfig<TConfigurator, TConfig>;

/**
 * This function both sets and return the current locale based on the given
 * _props_ by simply reading the dedicated \`[localeParamName]\` dynamic segment
 * of the URL.
 * It automatically 404s with next.js's \`notFound\` if the locale does not exists.
 */
export async function resolveConfigurator<
  TProps extends I18nNextProps,
  TConfig extends I18nServerConfig,
  TConfigurator extends I18nServerConfigurator<TConfig, TProps>,
>(rawProps: TProps, configurator?: TConfigurator) {
  const defaultParams = { ${localeParamName}: "" as I18n.Locale };
  const { params: rawParams = defaultParams, ...withoutParams } = rawProps || {
    params: defaultParams,
  };
  const { ${localeParamName}: localeParam, ...nonI18nParams } = await rawParams;${createGenerator.log(arg, "i18nServerHelpers", "resolveConfigurator", "localeParam")}
  const config = configurator
    ? typeof configurator === "function"
      ? await configurator({
          ...withoutParams,
          params: nonI18nParams,
          locale: localeParam || getLocale(),
        } as ResolvedProps<TProps & typeof defaultParams>)
      : configurator
    : null;
  const { locale: localeConfig, ...restConfig } = (config as TConfig) || {};
  const locale = localeConfig || localeParam || getLocale();

  if (isLocale(locale)) {
    // set the server context based locale as early as possible
    setLocale(locale);
  } else {
    notFound();
  }${createGenerator.log(arg, "i18nServerHelpers", "resolveConfigurator", "locale")}

  return { ...restConfig, locale, params: nonI18nParams };
};
`
    },
    i18nServer: {
      dir: createGenerator.dirs.server,
      name: "i18nServer",
      ext: "tsx",
      index: true,
      content: () => /* j s */ `
import { defaultLocale } from "../defaultLocale";
import { locales } from "../locales";
import { getLocale } from "./getLocale";
import { getT } from "./getT";
import { getTo } from "./getTo";
import { I18nLayoutRoot } from "./I18nLayoutRoot";
import { createI18nLayout } from "./I18nLayout";
import { createI18nPage } from "./I18nPage";

export type { I18n } from "../types";

export type I18nServer = typeof i18nServer;

export const i18nServer = {
  /**
   * {@link I18nLayoutRoot}
   * @example
   * 
   * \`\`\`
   * import { i18nServer } from "@/i18n/server";
   * 
   * // method 1)
   * export default i18nServer.LayoutRoot;
   * 
   * // method 2) if you need to wrap your app with other providers
   * const { LayoutRoot } = i18nServer;
   * 
   * export default (props: React.PropsWithChildren) => (
   *   <LayoutRoot>
   *     <MyProvider>{props.children}</MyProvider>
   *   </LayoutRoot>
   * );
   * \`\`\`
   */
  LayoutRoot: I18nLayoutRoot,
  /** {@link createI18nLayout} */
  layout: createI18nLayout,
  /** {@link createI18nPage} */
  page: createI18nPage,
  /** {@link defaultLocale} */
  defaultLocale,
  /** {@link locales} */
  locales,
  /** {@link getLocale} */
  getLocale,
  /** {@link getT} */
  getT,
  /** {@link getTo} */
  getTo,
};

export default i18nServer;
`,
    },
  };
});
