import { expectTypeOf } from "expect-type";
import type { Metadata as NextMetadata } from "next";
import { I18nUtils } from "./types";

describe("types", () => {
  describe("Alternates", () => {
    it("should be compatible with Next.js's Metadata->alternates->languages type", () => {
      expectTypeOf({
        en: "https://a.com",
      } satisfies I18nUtils.Alternates).toMatchTypeOf<
        NonNullable<NextMetadata["alternates"]>["languages"]
      >();
    });
  });

  describe("Metadata", () => {
    it("should be compatible with Next.js's Metadata->alternates type", () => {
      expectTypeOf({
        alternates: {
          en: "https://a.com",
        },
        canonical: "https://a.com",
      } satisfies I18nUtils.Metadata).toMatchTypeOf<
        NonNullable<NextMetadata["alternates"]>
      >();
    });
  });
});
