import { createGenerator } from "../../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    config: { single },
    options: {
      routes: { localeParamName },
    },
  } = arg;

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

/**
 * In next@15 params were transformed into a Promise.
 */
export type NextProps = Partial<
  Record<"params" | "searchParams", any | Promise<any>>
> & {};

type UnwrapParamsPromise<P> = Omit<P, "params"> &
  (P extends { params?: Promise<infer T> }
    ? { params: Simplify<Omit<T, keyof I18nParams>> }
    : P extends { params?: infer T }
      ? { params: Simplify<Omit<T, keyof I18nParams>> }
      : { params?: {} });

type ResolvedProps<P extends NextProps> = UnwrapParamsPromise<P> & {
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

export type I18nServerConfigurator<Config, Props extends NextProps> =
  | (<TRawProps>(props: ResolvedProps<Props & TRawProps>) => Config | Promise<Config>)
  | Config;

export type I18nProps<
  TProps extends NextProps,
  TRawProps extends NextProps,
  TConfig extends I18nServerConfig,
  TConfigurator extends I18nServerConfigurator<TConfig, TProps>
> = ResolvedProps<TProps & TRawProps> & ExtraConfig<TConfigurator, TConfig>;

/**
 * This function both sets and return the current locale based on the given
 * _props_ by simply reading the dedicated \`[localeParamName]\` dynamic segment
 * of the URL.
 * It automatically 404s with next.js's \`notFound\` if the locale does not exists.
 */
export async function resolveConfigurator<
  TProps extends NextProps,
  TRawProps extends NextProps,
  TConfig extends I18nServerConfig,
  TConfigurator extends I18nServerConfigurator<TConfig, TProps>
>(
  rawProps: TRawProps,
  configurator?: TConfigurator,
) {
  const { params: rawParams, ...rawPropsWithoutParams } = rawProps;
  const { ${localeParamName}, ...nonI18nParams } = await rawParams;
  const localeParam = ${localeParamName} as I18n.Locale;${createGenerator.log(arg, "i18nServerHelpers", "resolveConfigurator", "localeParam")}
  const configuratorProps = {
    ...rawPropsWithoutParams,
    params: nonI18nParams,
    locale: localeParam,
  } as ResolvedProps<TProps & TRawProps>;
  const config = configurator
    ? typeof configurator === "function"
      ? await configurator(configuratorProps)
      : configurator
    : null;
  const { locale: localeConfig, ...restConfig } =
    (config as TConfig) || {};
  const locale = localeConfig || localeParam || getLocale();

  if (isLocale(locale)) {
    ${
      single
        ? ``
        : `
    // set the server context based locale as early as possible
    setLocale(locale);
    `}
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
