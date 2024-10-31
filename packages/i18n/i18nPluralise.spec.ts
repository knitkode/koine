import { i18nPluralise } from "./i18nPluralise";

describe("i18nPluralise", () => {
  it("should return the value for the exact count", () => {
    const values = { 1: "one item", 2: "two items", 3: "three items" };
    expect(i18nPluralise(values, 1)).toBe("one item");
    expect(i18nPluralise(values, 2)).toBe("two items");
    expect(i18nPluralise(values, 3)).toBe("three items");
  });

  it("should return the value for the plural rule corresponding to the count", () => {
    const values = {
      one: "one item",
      few: "a few items",
      many: "many items",
      other: "other items",
      zero: "no items",
    };
    expect(i18nPluralise(values, 1)).toBe("one item");
    expect(i18nPluralise(values, 2)).toBe("other items");
    expect(i18nPluralise(values, 3)).toBe("other items");
    expect(i18nPluralise(values, 0)).toBe("other items");
  });

  it("should use numerical key before plural key", () => {
    const values = {
      1: "1 item",
      one: "one item",
      zero: "no items",
    };
    expect(i18nPluralise(values, 1)).toBe("1 item");
  });
});
