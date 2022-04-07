export * from "./Rating";

const RATING_WORDS = {
  0: "Worst",
  1: "Bad",
  2: "Mediocre",
  3: "Good",
  4: "Great",
  4.5: "Excellent",
  5: "Best",
} as const;

export const getRatingWord = (value: number, precision = 0.5) => {
  let buffer: keyof typeof RATING_WORDS = 0;
  let word;

  while (buffer < value) {
    // @ts-expect-error can't remember
    word = RATING_WORDS[buffer];
    buffer += precision;
  }

  return word;
};

export const getRatingValue = (value: number) => {
  const converted = convertRange(value, [0, 5], [0, 10]);
  if (converted % 1 === 0) {
    return converted;
  }
  return converted.toFixed(1);
};

/**
 * @see https://stackoverflow.com/a/14224813
 */
export function convertRange(
  value: number,
  r1: number[],
  r2: number[]
): number {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

export const deriveRating = (
  title: string,
  date: Date,
  minValue = 3.8,
  maxValue = 5,
  minQuantity = 9
) => {
  const entityTime = date.getTime();
  const nowTime = new Date().getTime();
  const length = title.length;
  const value = Number(
    convertRange(length, [0, 90], [minValue, maxValue]).toFixed(2)
  );
  const timeDifference = convertRange(
    nowTime - entityTime,
    [0, 10000000000000],
    [minQuantity, 999999]
  );
  const count = Math.round(timeDifference / length);

  return {
    value,
    count,
  };
};
