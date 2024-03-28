export const adapterNextOptions: AdapterNextOptions = {
  router: "app",
};

export type AdapterNextOptions = {
  /**
   * @default "app"
   */
  router?: "app" | "pages" | "migrating";
};
