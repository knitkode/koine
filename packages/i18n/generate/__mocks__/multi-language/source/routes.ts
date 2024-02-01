export const routes = {
  about: {
    en: "/about",
    it: "/chi-siamo",
  },
  "account.user.[id]": {
    en: "/account/user/[id]",
    it: "/account/profilo/[id]",
  },
  "account.user.profile": {
    en: "/account/user",
    it: "/account/profilo",
  },
  "account.user.settings": {
    en: "/account/user/settings",
    it: "/account/profilo/impostazioni",
  },
  "account.user.settings.personal": {
    en: "/account/user/settings/personal",
    it: "/account/profilo/impostazioni/personali",
  },
  "apps.tool": {
    en: "/apps/tool",
    it: "/apps/tool",
  },
  "apps.tool.[spa]": {
    it: "/apps/tool/[spa]",
  },
  "apps.tool.things": {
    en: "/things",
    it: "/things",
  },
  "apps.tool.things.[id]": {
    en: "/things/[id]",
    it: "/things/[id]",
  },
  "apps.tool.things.[id].detail": {
    en: "/things/[id]/detail",
    it: "/things/[id]/dettaglio",
  },
  "apps.tool.things.[id].detail.[detailId]": {
    en: "/things/[id]/detail/[detailId]",
    it: "/things/[id]/dettaglio/[detailId]",
  },
  "apps.tool.things.[id].detail.[detailId].edit": {
    en: "/things/[id]/detail/[detailId]/edit",
    it: "/things/[id]/dettaglio/[detailId]/edit",
  },
  "apps.tool.things.[id].detail.new": {
    en: "/things/[id]/detail/new",
    it: "/things/[id]/dettaglio/new",
  },
  home: {
    en: "/",
    it: "/",
  },
  products: {
    en: "/products",
    it: "/prodotti",
  },
  "products.[id]": {
    en: "/products/[id]",
    it: "/prodotti/[id]",
  },
  "products.[id].edit": {
    en: "/products/[id]/edit",
    it: "/prodotti/[id]/modifica",
  },
  "products.[id].edit.details": {
    en: "/products/[id]/edit/details",
    it: "/prodotti/[id]/modifica/dettagli",
  },
} as const;

export default routes;
