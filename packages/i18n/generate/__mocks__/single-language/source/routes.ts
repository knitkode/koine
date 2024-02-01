export const routes = {
  about: {
    en: "/about",
  },
  "account.user.[id]": {
    en: "/account/user/[id]",
  },
  "account.user.profile": {
    en: "/account/user",
  },
  "account.user.settings": {
    en: "/account/user/settings",
  },
  "account.user.settings.personal": {
    en: "/account/user/settings/personal",
  },
  "apps.tool": {
    en: "/apps/tool",
  },
  "apps.tool.things": {
    en: "/things",
  },
  "apps.tool.things.[id]": {
    en: "/things/[id]",
  },
  "apps.tool.things.[id].detail": {
    en: "/things/[id]/detail",
  },
  "apps.tool.things.[id].detail.[detailId]": {
    en: "/things/[id]/detail/[detailId]",
  },
  "apps.tool.things.[id].detail.[detailId].edit": {
    en: "/things/[id]/detail/[detailId]/edit",
  },
  "apps.tool.things.[id].detail.new": {
    en: "/things/[id]/detail/new",
  },
  home: {
    en: "/",
  },
  products: {
    en: "/products",
  },
  "products.[id]": {
    en: "/products/[id]",
  },
  "products.[id].edit": {
    en: "/products/[id]/edit",
  },
  "products.[id].edit.details": {
    en: "/products/[id]/edit/details",
  },
} as const;

export default routes;
