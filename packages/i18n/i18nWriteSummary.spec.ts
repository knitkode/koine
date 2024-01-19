import { join } from "node:path";
import { i18nWriteSummary } from "./i18nWriteSummary";

test("test runs", async () => {
  await i18nWriteSummary({
    cwd: join(process.cwd(), "/packages/i18n/__mocks__"),
    defaultLocale: "en",
    outputJson: "summary.json",
    outputMarkdown: "summary.md",
    sourceUrl: "https://github.com/your-network/translations/tree/dev",
  });
});
