import { toFormat } from "./toFormat";
import type { I18n } from "./types";

export const to_about = (locale?: I18n.Locale) =>
  toFormat(locale, locale === "it" ? "/chi-siamo" : "/about");
export const to_accountUserId = (
  params: I18n.RouteParams.AccountUserId,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it" ? "/account/profilo/[id]" : "/account/user/[id]",
    params,
  );
export const to_accountUserProfile = (locale?: I18n.Locale) =>
  toFormat(locale, locale === "it" ? "/account/profilo" : "/account/user");
export const to_accountUserSettings = (locale?: I18n.Locale) =>
  toFormat(
    locale,
    locale === "it"
      ? "/account/profilo/impostazioni"
      : "/account/user/settings",
  );
export const to_accountUserSettingsPersonal = (locale?: I18n.Locale) =>
  toFormat(
    locale,
    locale === "it"
      ? "/account/profilo/impostazioni/personali"
      : "/account/user/settings/personal",
  );
export const to_appsTool = (locale?: I18n.Locale) =>
  toFormat(locale, "/apps/tool");
export const to_appsToolSpa = (
  params: I18n.RouteParams.AppsToolSpa,
  locale?: I18n.Locale,
) =>
  toFormat(locale, locale === "it" ? "/apps/tool/[spa]" : "undefined", params);
export const to_appsToolThings = (locale?: I18n.Locale) =>
  toFormat(locale, "/things");
export const to_appsToolThingsId = (
  params: I18n.RouteParams.AppsToolThingsId,
  locale?: I18n.Locale,
) => toFormat(locale, "/things/[id]", params);
export const to_appsToolThingsIdDetail = (
  params: I18n.RouteParams.AppsToolThingsIdDetail,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it" ? "/things/[id]/dettaglio" : "/things/[id]/detail",
    params,
  );
export const to_appsToolThingsIdDetailDetailId = (
  params: I18n.RouteParams.AppsToolThingsIdDetailDetailId,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it"
      ? "/things/[id]/dettaglio/[detailId]"
      : "/things/[id]/detail/[detailId]",
    params,
  );
export const to_appsToolThingsIdDetailDetailIdEdit = (
  params: I18n.RouteParams.AppsToolThingsIdDetailDetailIdEdit,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it"
      ? "/things/[id]/dettaglio/[detailId]/edit"
      : "/things/[id]/detail/[detailId]/edit",
    params,
  );
export const to_appsToolThingsIdDetailNew = (
  params: I18n.RouteParams.AppsToolThingsIdDetailNew,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it" ? "/things/[id]/dettaglio/new" : "/things/[id]/detail/new",
    params,
  );
export const to_home = (locale?: I18n.Locale) => toFormat(locale, "/");
export const to_products = (locale?: I18n.Locale) =>
  toFormat(locale, locale === "it" ? "/prodotti" : "/products");
export const to_productsId = (
  params: I18n.RouteParams.ProductsId,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it" ? "/prodotti/[id]" : "/products/[id]",
    params,
  );
export const to_productsIdEdit = (
  params: I18n.RouteParams.ProductsIdEdit,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it" ? "/prodotti/[id]/modifica" : "/products/[id]/edit",
    params,
  );
export const to_productsIdEditDetails = (
  params: I18n.RouteParams.ProductsIdEditDetails,
  locale?: I18n.Locale,
) =>
  toFormat(
    locale,
    locale === "it"
      ? "/prodotti/[id]/modifica/dettagli"
      : "/products/[id]/edit/details",
    params,
  );
