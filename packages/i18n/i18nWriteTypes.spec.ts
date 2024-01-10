import { join } from "node:path";
import { i18nWriteTypes } from "./i18nWriteTypes";

test("test runs", async () => {
  await i18nWriteTypes({
    cwd: join(process.cwd(), "__mocks__"),
    defaultLocale: "en",
    outputTypes: "types.d.ts",
  });
});
