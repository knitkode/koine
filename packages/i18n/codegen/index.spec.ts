// import { jestCreateExpectedThrownError } from "@koine/node/jest";
import { to } from "./__mocks__/multi-language/source/to";
import * as multiToFns from "./__mocks__/multi-language/source/toFns";
import * as singleToFns from "./__mocks__/single-language/source/toFns";

// const err = jestCreateExpectedThrownError("@koine/i18n", "to");

// import {
//   buildRoutePathnameUntil,
//   buildRoutePathnameUntilParent,
// } from "./routeHelpers";

describe("generated sources: to", () => {
  test("all routes urls", () => {
    expect(singleToFns.to_about()).toEqual("/about");
    expect(multiToFns.to_about()).toEqual("/about");
    // expect(to("about")).toEqual("/about");
    expect(multiToFns.to_about("it")).toEqual("/it/about");
    expect(to("about", "it")).toEqual("/it/about");

    // @ts-expect-error test wrong implementation
    singleToFns.to_about("it");
    // @ts-expect-error test wrong implementation
    singleToFns.to_about("en");

    expect(multiToFns.to_accountUserId({ id: "a" })).toEqual("/account/user/a");
    expect(to("account.user.[id]", { id: "a" })).toEqual("/account/user/a");
  });
});

describe("getDataRoutes", () => {
  // test("buildRoutePathnameUntil", () => {
  //   const routes = {
  //     a: {
  //       index: 1,
  //       b: {
  //         index: 2,
  //         "[c]": 3,
  //       },
  //       b2: {
  //         index: "1",
  //         c: {
  //           index: "2",
  //           d: {
  //             index: "3",
  //             e: {
  //               index: "4",
  //               f: "f",
  //             },
  //           },
  //         },
  //       },
  //     },
  //   };
  //   expect(buildRoutePathnameUntil(routes, "a.b")).toEqual("1.2");
  //   expect(buildRoutePathnameUntilParent(routes, "a.b.[c]")).toEqual("1.2");
  //   expect(buildRoutePathnameUntilParent(routes, "a.b2.c.d.e.f")).toEqual(
  //     "1.1.2.3.4",
  //   );
  // });
});
