import { createConsola } from "consola";

export const i18nLogger = createConsola({
  defaults: {
    // tag: "@koine/i18n",
    tag: "i18n",
  },
  level: 3,
  fancy: true,
  formatOptions: {
    columns: 40, // 80
    // colors: false,
    // compact: false,
    date: false,
  },
});
