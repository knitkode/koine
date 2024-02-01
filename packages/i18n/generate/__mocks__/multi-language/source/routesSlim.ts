export const routesSlim = {
  about: {
    it: "/chi-siamo",
    en: "/about",
  },
  "account.user.[id]": {
    it: "/account/profilo/[id]",
    en: "/account/user/[id]",
  },
  "account.user.profile": {
    it: "/account/profilo",
    en: "/account/user",
  },
  "account.user.settings": {
    it: "/account/profilo/impostazioni",
    en: "/account/user/settings",
  },
  "account.user.settings.personal": {
    it: "/account/profilo/impostazioni/personali",
    en: "/account/user/settings/personal",
  },
  "apps.tool": "/apps/tool",
  "apps.tool.[spa]": {
    it: "/apps/tool/[spa]",
  },
  "apps.tool.things": "/things",
  "apps.tool.things.[id]": "/things/[id]",
  "apps.tool.things.[id].detail": {
    it: "/things/[id]/dettaglio",
    en: "/things/[id]/detail",
  },
  "apps.tool.things.[id].detail.[detailId]": {
    it: "/things/[id]/dettaglio/[detailId]",
    en: "/things/[id]/detail/[detailId]",
  },
  "apps.tool.things.[id].detail.[detailId].edit": {
    it: "/things/[id]/dettaglio/[detailId]/edit",
    en: "/things/[id]/detail/[detailId]/edit",
  },
  "apps.tool.things.[id].detail.new": {
    it: "/things/[id]/dettaglio/new",
    en: "/things/[id]/detail/new",
  },
  home: "/",
  products: {
    it: "/prodotti",
    en: "/products",
  },
  "products.[id]": {
    it: "/prodotti/[id]",
    en: "/products/[id]",
  },
  "products.[id].edit": {
    it: "/prodotti/[id]/modifica",
    en: "/products/[id]/edit",
  },
  "products.[id].edit.details": {
    it: "/prodotti/[id]/modifica/dettagli",
    en: "/products/[id]/edit/details",
  },
} as const;

export default routesSlim;
