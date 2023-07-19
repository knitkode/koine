import { addOrReplaceAtIdx } from "./addOrReplaceAtIdx";

test("replaces the item at the right index", () => {
  expect(addOrReplaceAtIdx([1, 2, 3], 4, 1)).toEqual([1, 4, 3]);
});

test("should return a new array despite items are the same", () => {
  const a = [1, 2, 3];
  const b = addOrReplaceAtIdx(a, 1, 0);
  expect(b === a).toBeFalsy();
  expect(b).toEqual(a);
});
