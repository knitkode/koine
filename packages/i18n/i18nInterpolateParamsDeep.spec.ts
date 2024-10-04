// Adjust the import path as necessary
import { i18nInterpolateParamsDeep } from "./i18nInterpolateParamsDeep";

describe("i18nInterpolateParamsDeep", () => {
  it("should interpolate string values in an array", () => {
    const value = ["Hello, {{ name }}!", "Welcome, {{ name }}!"];
    const params = { name: "John" };
    const result = i18nInterpolateParamsDeep(value, params);
    expect(result).toEqual(["Hello, John!", "Welcome, John!"]);
  });

  it("should interpolate string values in an object", () => {
    const value = {
      greeting: "Hello, {{ name }}!",
      farewell: "Goodbye, {{ name }}!",
    };
    const params = { name: "John" };
    const result = i18nInterpolateParamsDeep(value, params);
    expect(result).toEqual({
      greeting: "Hello, John!",
      farewell: "Goodbye, John!",
    });
  });

  it("should interpolate nested objects", () => {
    const value = {
      user: { greeting: "Hello, {{ name }}!", age: "{{ age }}" },
    };
    const params = { name: "Alice", age: 30 };
    const result = i18nInterpolateParamsDeep(value, params);
    expect(result).toEqual({ user: { greeting: "Hello, Alice!", age: "30" } });
  });

  it("should interpolate nested arrays", () => {
    const value = [
      { message: "Your score is {{ score }}." },
      { message: "Hello, {{ name }}!" },
    ];
    const params = { score: 100, name: "Bob" };
    const result = i18nInterpolateParamsDeep(value, params);
    expect(result).toEqual([
      { message: "Your score is 100." },
      { message: "Hello, Bob!" },
    ]);
  });

  it("should return original value if no params are provided", () => {
    const value = { greeting: "Hello, {{ name }}!" };
    const result = i18nInterpolateParamsDeep(value);
    expect(result).toEqual({ greeting: "Hello, {{ name }}!" });
  });

  it("should return original value for empty objects and arrays", () => {
    const emptyArray: string[] = [];
    const emptyObject = {};
    expect(i18nInterpolateParamsDeep(emptyArray)).toEqual(emptyArray);
    expect(i18nInterpolateParamsDeep(emptyObject)).toEqual(emptyObject);
  });

  it("should handle mixed types in an object", () => {
    const value = {
      title: "Welcome, {{ name }}!",
      details: ["You have {{ count }} messages.", "Enjoy!"],
    };
    const params = { name: "Charlie", count: 5 };
    const result = i18nInterpolateParamsDeep(value, params);
    expect(result).toEqual({
      title: "Welcome, Charlie!",
      details: ["You have 5 messages.", "Enjoy!"],
    });
  });

  it("should interpolate deeply nested structures", () => {
    const value = {
      user: {
        profile: {
          greeting: "Hello, {{ userName }}!",
          stats: [{ message: "You have {{ score }} points." }],
        },
      },
    };
    const params = { userName: "Diana", score: 42 };
    const result = i18nInterpolateParamsDeep(value, params);
    expect(result).toEqual({
      user: {
        profile: {
          greeting: "Hello, Diana!",
          stats: [{ message: "You have 42 points." }],
        },
      },
    });
  });
});
