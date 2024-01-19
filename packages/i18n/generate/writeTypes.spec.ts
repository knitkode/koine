import { join } from "node:path";
import { writeTypes } from "./writeTypes";

test("test runs", async () => {
  await writeTypes({
    cwd: join(process.cwd(), "packages/i18n/generate/__mocks__"),
    defaultLocale: "en",
    outputTypes: "types.d.ts",
  });
});
