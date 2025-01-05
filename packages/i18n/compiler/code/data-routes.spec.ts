import { resolveCodeDataOptions } from "./data";
import { getCodeDataRoutes } from "./data-routes";

describe("getCodeDataRoutes", () => {
  const config = {
    baseUrl: "/",
    debug: false,
    defaultLocale: "en",
    hideDefaultLocaleInUrl: false,
    locales: ["en"],
    logLevel: 0 as const,
    single: false,
    trailingSlash: false,
  };

  it("should handle various forms of route dyanmic definitions", () => {
    const data = getCodeDataRoutes(config, resolveCodeDataOptions({}).routes, {
      locales: ["en"],
      routes: {
        "blog.[slug1]": {
          en: "/blog/[slug]",
        },
        "blog.[slug2]": {
          en: "/blog/:slug",
        },
        "blog.[slug3]": {
          en: "/blog/[ slug ]",
        },
        "blog.[slug4]": {
          en: "/blog/{{ slug }}",
        },
        "blog.[slug5]": {
          en: "/blog/{ slug }",
        },
        "blog.[slug6]": {
          en: "/blog/{slug }",
        },
        "[slug1]": {
          en: "/[slug]",
        },
        "[slug2]": {
          en: "/:slug",
        },
        "[slug3]": {
          en: "/[ slug ]",
        },
        "[slug4]": {
          en: "/{{ slug }}",
        },
        "[slug5]": {
          en: "/{ slug }",
        },
        "[slug6]": {
          en: "/{slug }",
        },
      },
    });

    [1, 2, 3, 4, 5, 6].forEach((n) => {
      expect(data.byId[`blog.[slug${n}]`].pathnames["en"]).toEqual(
        "/blog/[slug]",
      );
    });

    [1, 2, 3, 4, 5, 6].forEach((n) => {
      expect(data.byId[`[slug${n}]`].pathnames["en"]).toEqual("/[slug]");
    });
  });

  it("should handle parent route 'inheritance'", () => {
    const data = getCodeDataRoutes(config, resolveCodeDataOptions({
      routes: {
        tokens: {
          parentReference: "PARENT"
        }
      }
    }).routes, {
      locales: ["en"],
      routes: {
        "product.[slug]": {
          en: "/product/[slug]",
        },
        "product.[slug].edit": {
          en: "PARENT/edit",
        },
        "product.[slug].edit.[fieldId]": {
          en: "PARENT/field/{fieldId}",
        },
      },
    });

    expect(data.byId["product.[slug].edit"].pathnames["en"]).toEqual(
      "/product/[slug]/edit",
    );
    expect(data.byId["product.[slug].edit.[fieldId]"].pathnames["en"]).toEqual(
      "/product/[slug]/edit/field/[fieldId]",
    );
  });
});
