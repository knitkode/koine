import { join } from "node:path";
import { i18nWriteTypes } from "./i18nWriteTypes";

test("test runs", async () => {
  await i18nWriteTypes({
    cwd: join(process.cwd(), "packages/i18n/__mocks__"),
    defaultLocale: "en",
    outputTypes: "types.d.ts",
  });
});
