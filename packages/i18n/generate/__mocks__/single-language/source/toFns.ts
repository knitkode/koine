import { toFormat } from "./toFormat";
import type { I18n } from "./types";

export const to_about = () => toFormat("", "/about");
export const to_accountUserId = (params: I18n.RouteParams.AccountUserId) =>
  toFormat("", "/account/user/[id]", params);
export const to_accountUserProfile = () => toFormat("", "/account/user");
export const to_accountUserSettings = () =>
  toFormat("", "/account/user/settings");
export const to_accountUserSettingsPersonal = () =>
  toFormat("", "/account/user/settings/personal");
export const to_appsTool = () => toFormat("", "/apps/tool");
export const to_appsToolThings = () => toFormat("", "/things");
export const to_appsToolThingsId = (
  params: I18n.RouteParams.AppsToolThingsId,
) => toFormat("", "/things/[id]", params);
export const to_appsToolThingsIdDetail = (
  params: I18n.RouteParams.AppsToolThingsIdDetail,
) => toFormat("", "/things/[id]/detail", params);
export const to_appsToolThingsIdDetailDetailId = (
  params: I18n.RouteParams.AppsToolThingsIdDetailDetailId,
) => toFormat("", "/things/[id]/detail/[detailId]", params);
export const to_appsToolThingsIdDetailDetailIdEdit = (
  params: I18n.RouteParams.AppsToolThingsIdDetailDetailIdEdit,
) => toFormat("", "/things/[id]/detail/[detailId]/edit", params);
export const to_appsToolThingsIdDetailNew = (
  params: I18n.RouteParams.AppsToolThingsIdDetailNew,
) => toFormat("", "/things/[id]/detail/new", params);
export const to_home = () => toFormat("", "/");
export const to_products = () => toFormat("", "/products");
export const to_productsId = (params: I18n.RouteParams.ProductsId) =>
  toFormat("", "/products/[id]", params);
export const to_productsIdEdit = (params: I18n.RouteParams.ProductsIdEdit) =>
  toFormat("", "/products/[id]/edit", params);
export const to_productsIdEditDetails = (
  params: I18n.RouteParams.ProductsIdEditDetails,
) => toFormat("", "/products/[id]/edit/details", params);
