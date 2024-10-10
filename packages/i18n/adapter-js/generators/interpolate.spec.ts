import { i18nInterpolateParams } from "./i18nInterpolateParams";
import { i18nInterpolateParamsDeep } from "./i18nInterpolateParamsDeep";

describe("i18nInterpolateParamsDeep", () => {
  const fn = i18nInterpolateParamsDeep().$createTestableFn(
    i18nInterpolateParams({
      start: "{{",
      end: "}}",
    }).$createTestableFn(),
  );

  test("interpolate simple string", () => {
    expect(fn("a")).toEqual("a");
    expect(fn("a {{ val }}", { val: "1" })).toEqual("a 1");
  });

  test("interpolate objects and arrays", () => {
    expect(fn({ obj: "a {{ val }}" }, { val: "1" })).toEqual({
      obj: "a 1",
    });

    expect(fn({ arr: ["a {{ val }}", "b {{ val }}"] }, { val: "1" })).toEqual({
      arr: ["a 1", "b 1"],
    });

    expect(fn({ arr: ["a {{ val }}", "b {{ val }}"] }, { val: "1" })).toEqual({
      arr: ["a 1", "b 1"],
    });

    expect(
      fn(
        {
          obj: {
            key1: "a",
            obj2: { key21: "a {{ val }}", key22: "{{ val }}!" },
            arr2: ["{{ val }}", "{{ val }}-1", "{{ val }}-2", "{{ val }}-3"],
          },
        },
        { val: "1" },
      ),
    ).toEqual({
      obj: {
        key1: "a",
        obj2: { key21: "a 1", key22: "1!" },
        arr2: ["1", "1-1", "1-2", "1-3"],
      },
    });
  });
});
