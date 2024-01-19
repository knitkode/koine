import { join } from "node:path";
import { writeSummary } from "./writeSummary";

test("test runs", async () => {
  await writeSummary({
    cwd: join(process.cwd(), "/packages/i18n/generate/__mocks__"),
    defaultLocale: "en",
    outputJson: "summary.json",
    outputMarkdown: "summary.md",
    sourceUrl: "https://github.com/your-network/translations/tree/dev",
  });
});
