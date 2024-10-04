import { i18nInterpolateParams } from "./i18nInterpolateParams";

describe("i18nInterpolateParams", () => {
  it("should interpolate string parameters correctly", () => {
    const value = "Hello, {{ name }}!";
    const params = { name: "John" };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("Hello, John!");
  });

  it("should interpolate number parameters correctly", () => {
    const value = "You have {{ count }} new messages.";
    const params = { count: 5 };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("You have 5 new messages.");
  });

  it("should interpolate boolean parameters correctly", () => {
    const value = "The status is {{ isActive }}.";
    const params = { isActive: true };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("The status is true.");
  });

  it("should return the original value when no params are provided", () => {
    const value = "Hello, {{ name }}!";
    const result = i18nInterpolateParams(value);
    expect(result).toBe("Hello, {{ name }}!");
  });

  it("should return the original value when params do not match", () => {
    const value = "Hello, {{ name }}!";
    const params = { age: 30 };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("Hello, {{ name }}!");
  });

  it("should handle multiple parameters correctly", () => {
    const value = "{{ greeting }}, {{ name }}!";
    const params = { greeting: "Hi", name: "Alice" };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("Hi, Alice!");
  });

  it("should handle extra spaces in keys", () => {
    const value = "Your score is {{  score  }}.";
    const params = { score: 10 };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("Your score is 10.");
  });

  it("should return the original value when value is empty", () => {
    const value = "";
    const params = { name: "John" };
    const result = i18nInterpolateParams(value, params);
    expect(result).toBe("");
  });
});
