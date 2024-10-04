import { formatRoutePathname } from "./formatRoutePathname";

describe("formatRoutePathname", () => {
  it('should return "/" for an empty pathname', () => {
    expect(formatRoutePathname()).toBe("/");
  });

  it('should return "/" for a pathname that is an empty string', () => {
    expect(formatRoutePathname("")).toBe("/");
  });

  it("should return a formatted pathname with leading and trailing slashes", () => {
    expect(formatRoutePathname("example")).toBe("/example");
  });

  it("should remove consecutive slashes", () => {
    expect(formatRoutePathname("example///test")).toBe("/example/test");
  });

  it("should keep a single trailing slash if specified", () => {
    expect(formatRoutePathname("example", { trailingSlash: true })).toBe(
      "/example/",
    );
  });

  it("should remove trailing slashes if trailingSlash option is false", () => {
    expect(formatRoutePathname("example/", { trailingSlash: false })).toBe(
      "/example",
    );
  });

  it("should handle leading and trailing slashes correctly", () => {
    expect(formatRoutePathname("/example/")).toBe("/example");
  });

  it("should handle consecutive slashes at the beginning and end", () => {
    expect(formatRoutePathname("///example///")).toBe("/example");
  });

  it('should return "/" for a pathname with only slashes', () => {
    expect(formatRoutePathname("/////")).toBe("/");
  });

  it("should handle undefined pathname gracefully", () => {
    expect(formatRoutePathname(undefined)).toBe("/");
  });

  it("should handle pathname with mixed leading and trailing slashes", () => {
    expect(formatRoutePathname("/example/test///")).toBe("/example/test");
  });

  it("should maintain a single slash when options are not specified", () => {
    expect(formatRoutePathname("/")).toBe("/");
  });

  it("should handle path with multiple segments", () => {
    expect(formatRoutePathname("example/test///path")).toBe(
      "/example/test/path",
    );
  });
});
