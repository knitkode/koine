import { join } from "node:path";
import { writeRoutes } from "./writeRoutes";

test("test runs", async () => {
  await writeRoutes({
    cwd: join(process.cwd(), "/packages/i18n/generate/__mocks__"),
    outputJson: "routes.json",
    defaultLocale: "en",
  });
});
