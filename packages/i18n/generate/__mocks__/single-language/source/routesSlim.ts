export const routesSlim = {
  about: "/about",
  "account.user.[id]": "/account/user/[id]",
  "account.user.profile": "/account/user",
  "account.user.settings": "/account/user/settings",
  "account.user.settings.personal": "/account/user/settings/personal",
  "apps.tool": "/apps/tool",
  "apps.tool.things": "/things",
  "apps.tool.things.[id]": "/things/[id]",
  "apps.tool.things.[id].detail": "/things/[id]/detail",
  "apps.tool.things.[id].detail.[detailId]": "/things/[id]/detail/[detailId]",
  "apps.tool.things.[id].detail.[detailId].edit":
    "/things/[id]/detail/[detailId]/edit",
  "apps.tool.things.[id].detail.new": "/things/[id]/detail/new",
  home: "/",
  products: "/products",
  "products.[id]": "/products/[id]",
  "products.[id].edit": "/products/[id]/edit",
  "products.[id].edit.details": "/products/[id]/edit/details",
} as const;

export default routesSlim;
