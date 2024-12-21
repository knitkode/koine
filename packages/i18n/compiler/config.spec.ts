import { configDefaults, getConfig } from "./config";

describe("getConfig", () => {
  test("should return default config when no options are provided", () => {
    const dataInput = { locales: ["en"] };
    const config = getConfig(dataInput);
    expect(config).toEqual({
      ...configDefaults,
      locales: ["en"],
      defaultLocale: "en",
      single: true,
    });
  });

  test("should merge provided options with defaults", () => {
    const dataInput = { locales: ["en", "fr"] };
    const options = { baseUrl: "http://test.com", defaultLocale: "fr" };
    const config = getConfig(dataInput, options);
    expect(config.baseUrl).toBe("http://test.com");
    expect(config.locales).toEqual(["fr", "en"]);
    expect(config.defaultLocale).toBe("fr");
    expect(config.single).toBe(false);
  });

  test("should normalize the base URL", () => {
    const dataInput = { locales: ["en"] };
    const options = { baseUrl: "http://test.com//" };
    const config = getConfig(dataInput, options);
    expect(config.baseUrl).toBe("http://test.com");
  });

  test("should use locales from dataInput if options.locales is not provided", () => {
    const dataInput = { locales: ["en", "fr"] };
    const config = getConfig(dataInput);
    expect(config.locales).toEqual(["en", "fr"]);
  });

  test("should sort locales moving the defaultLocale first", () => {
    const dataInput = { locales: ["en", "fr"] };
    const config = getConfig(dataInput, {
      baseUrl: "http://test.com",
      defaultLocale: "fr",
    });
    expect(config.locales).toEqual(["fr", "en"]);
  });

  test("should set defaultLocale to the first locale if not provided", () => {
    const dataInput = { locales: ["en", "fr"] };
    const config = getConfig(dataInput);
    expect(config.defaultLocale).toBe("en");
  });

  test("should respect hideDefaultLocaleInUrl option", () => {
    const dataInput = { locales: ["en"] };
    const options = {
      baseUrl: "http://test.com",
      hideDefaultLocaleInUrl: false,
    };
    const config = getConfig(dataInput, options);
    expect(config.hideDefaultLocaleInUrl).toBe(false);
  });

  test("should default hideDefaultLocaleInUrl to configDefaults if not provided", () => {
    const dataInput = { locales: ["en"] };
    const config = getConfig(dataInput);
    expect(config.hideDefaultLocaleInUrl).toBe(
      configDefaults.hideDefaultLocaleInUrl,
    );
  });

  test("should handle undefined locales in options gracefully", () => {
    const dataInput = { locales: ["en"] };
    const options = { baseUrl: "http://test.com", locales: undefined };
    const config = getConfig(dataInput, options);
    expect(config.locales).toEqual(["en"]);
    expect(config.defaultLocale).toBe("en");
  });

  test("should return single true if only one locale is present", () => {
    const dataInput = { locales: ["en"] };
    const config = getConfig(dataInput);
    expect(config.single).toBe(true);
  });

  test("should return single false if multiple locales are present", () => {
    const dataInput = { locales: ["en", "fr"] };
    const config = getConfig(dataInput);
    expect(config.single).toBe(false);
  });
});
