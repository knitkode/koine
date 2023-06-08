import { roundTo } from "./roundTo";

test("round decimals to given nr", () => {
  expect(roundTo(1.123456789)).toEqual("1.12");
  expect(roundTo(1.12)).toEqual("1.12");
  expect(roundTo(1.123456789, 3)).toEqual("1.123");
  expect(roundTo(0.123456789, 1)).toEqual("0.1");
  expect(roundTo(1.123456789, 0)).toEqual("1");
});

test("round support already rounded numbers", () => {
  expect(roundTo(1, 3)).toEqual("1");
  expect(roundTo(0, 1)).toEqual("0");
  expect(roundTo(99)).toEqual("99");
  expect(roundTo(100.0, 0)).toEqual("100");
});
