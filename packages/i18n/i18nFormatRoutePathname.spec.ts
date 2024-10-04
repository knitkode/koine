import { i18nFormatRoutePathname } from "./i18nFormatRoutePathname";

describe("i18nFormatRoutePathname", () => {
  it('should return "/" for an empty pathname', () => {
    expect(i18nFormatRoutePathname()).toBe("/");
  });

  it('should return "/" for a pathname that is an empty string', () => {
    expect(i18nFormatRoutePathname("")).toBe("/");
  });

  it("should return a formatted pathname with leading and trailing slashes", () => {
    expect(i18nFormatRoutePathname("example")).toBe("/example");
  });

  it("should remove consecutive slashes", () => {
    expect(i18nFormatRoutePathname("example///test")).toBe("/example/test");
  });

  it("should keep a single trailing slash if specified", () => {
    expect(i18nFormatRoutePathname("example", { trailingSlash: true })).toBe(
      "/example/",
    );
  });

  it("should remove trailing slashes if trailingSlash option is false", () => {
    expect(i18nFormatRoutePathname("example/", { trailingSlash: false })).toBe(
      "/example",
    );
  });

  it("should handle leading and trailing slashes correctly", () => {
    expect(i18nFormatRoutePathname("/example/")).toBe("/example");
  });

  it("should handle consecutive slashes at the beginning and end", () => {
    expect(i18nFormatRoutePathname("///example///")).toBe("/example");
  });

  it('should return "/" for a pathname with only slashes', () => {
    expect(i18nFormatRoutePathname("/////")).toBe("/");
  });

  it("should handle undefined pathname gracefully", () => {
    expect(i18nFormatRoutePathname(undefined)).toBe("/");
  });

  it("should handle pathname with mixed leading and trailing slashes", () => {
    expect(i18nFormatRoutePathname("/example/test///")).toBe("/example/test");
  });

  it("should maintain a single slash when options are not specified", () => {
    expect(i18nFormatRoutePathname("/")).toBe("/");
  });

  it("should handle path with multiple segments", () => {
    expect(i18nFormatRoutePathname("example/test///path")).toBe(
      "/example/test/path",
    );
  });
});
