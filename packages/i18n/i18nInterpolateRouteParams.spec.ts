import {
  jestCreateExpectedThrownError,
  jestSetNodeEnv,
} from "@koine/test/jest";
import { i18nInterpolateRouteParams as fn } from "./i18nInterpolateRouteParams";

// /**
//  *
//  * @see https://stackoverflow.com/a/41407246/1938970
//  *
//  * @usage
//  * ```ts
//  * const err = jestCreateExpectedThrownError("@org/pkg", "fnName");
//  *
//  * // @ts-expect-error test wrong implementation
//  * err(() => fnName("wrong arguments implementation"));
//  * ```
//  */
// const jestCreateExpectedThrownError =
//   (pkgName: string, fnName: string) =>
//   (expectFn: () => ReturnType<jest.Expect>) => {
//     try {
//       expectFn().toThrow(new RegExp(`\\[${pkgName}\\]::${fnName}, .*`, "g"));
//     } catch (e) {
//       log(
//         "\x1b[32m",
//         "   ✓",
//         "\x1b[0m",
//         "throw",
//         "\x1b[2m",
//         (e as Error).message.replace(`[${pkgName}]::${fnName}, `, ""),
//       );
//     }
//   };

const err = jestCreateExpectedThrownError(
  "@koine/i18n",
  "i18nInterpolateRouteParams",
);

describe("i18nInterpolateRouteParams", () => {
  const params = { id: 1, slug: "a" };

  test("with homepage special cases", () => {
    expect(fn("")).toEqual("/");
    expect(fn(".")).toEqual("/");
    expect(fn("/")).toEqual("/");
    expect(fn("///")).toEqual("/");
  });

  test("with no params", () => {
    expect(fn("my")).toEqual("/my");
  });

  test("with exceeding params keys", () => {
    expect(fn("my.[id]", params)).toEqual("/my/1");
    expect(fn("my/[id]", params)).toEqual("/my/1");
  });

  test("with different and malformed separators syntaxes", () => {
    expect(fn("my.[id]", params)).toEqual("/my/1");
    expect(fn(".my.[id]", params)).toEqual("/my/1");
    expect(fn("my/[id]", params)).toEqual("/my/1");
    expect(fn("/my//[id]", params)).toEqual("/my/1");
  });

  test("with multiple params", () => {
    expect(fn("my.[id].view.[slug]", params)).toEqual("/my/1/view/a");
    expect(fn("my/[id]/view/[slug]", params)).toEqual("/my/1/view/a");
  });

  test("with different folder delimiters", () => {
    expect(fn("my.[id].view.[slug]", params)).toEqual("/my/1/view/a");
    expect(fn("my.[ id ].view.[ slug ]", params)).toEqual("/my/1/view/a");
    expect(fn("my.{id}.view.{slug}", params)).toEqual("/my/1/view/a");
    expect(fn("my.{ id }.view.{ slug }", params)).toEqual("/my/1/view/a");
    expect(fn("my.{{id}}.view.{{slug}}", params)).toEqual("/my/1/view/a");
    expect(fn("my.{{ id }}.view.{{ slug }}", params)).toEqual("/my/1/view/a");
  });

  test("with equally named params", () => {
    expect(fn("my.[id].view.[slug].[id]", params)).toEqual("/my/1/view/a/1");
  });

  test("with only dynamic params ", () => {
    expect(fn("[slug]", params)).toEqual("/a");
    expect(fn("[slug].[id]", params)).toEqual("/a/1");
    expect(fn("[slug]/[id]", params)).toEqual("/a/1");
  });

  test("with differently positioned multiple dynamic params ", () => {
    expect(fn("[slug].my.[id]", params)).toEqual("/a/my/1");
    expect(fn("[slug]/my/[id]", params)).toEqual("/a/my/1");
    expect(fn("[slug].[id].my", params)).toEqual("/a/1/my");
    expect(fn("[slug]/[id]/my", params)).toEqual("/a/1/my");
    expect(fn("[slug].[id]", params)).toEqual("/a/1");
    expect(fn("[slug]/[id]", params)).toEqual("/a/1");
    expect(fn("my.[slug].[id]", params)).toEqual("/my/a/1");
    expect(fn("my/[slug]/[id]", params)).toEqual("/my/a/1");
  });

  test("disallowing wrong usage ts side", () => {
    jestSetNodeEnv("development");

    // // @ts-expect-error test wrong implementation
    // expect(fn("my.static", params)).toEqual("/my/static");
    // // @ts-expect-error test wrong implementation
    // expect(fn("my", {})).toEqual("/my");

    // @ts-expect-error test wrong implementation
    err(() => fn("[slug].my.[id].[missing]"));
    // @ts-expect-error test wrong implementation
    err(() => fn("[slug].my.[id]", { ...params, id: new Date() }));
    // @ts-expect-error test wrong implementation
    err(() => fn("my.[id].view", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my/[id]/view", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my/{id}/view", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my/{ id }/view", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my.{{ id }}.view.{{ slug }}", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my.{{id}}.view.{{slug}}", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my.{id}.view.{slug}", {}));
    // @ts-expect-error test wrong implementation
    err(() => fn("my.[id].view.[slug]", {}));
  });
});
