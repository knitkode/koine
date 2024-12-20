/**
 * @module
 *
 * Slightly adapted from Kent C. Dodd's [match-sorter](https://github.com/kentcdodds/match-sorter)
 * differences are:
 * - less exports
 * - smaller output
 * - no external deps
 *
 * TODO: turn objects into arrays for smaller output?
 *
 * @name match-sorter
 * @borrows [kentcdodds/match-sorter](https://github.com/kentcdodds/match-sorter)
 */
import { isString } from "./isString";
import { removeAccents } from "./removeAccents";

type KeyAttributes = {
  threshold?: Ranking;
  maxRanking: Ranking;
  minRanking: Ranking;
};

interface RankingInfo {
  rankedValue: string;
  rank: Ranking;
  keyIndex: number;
  keyThreshold: Ranking | undefined;
}

interface ValueGetterKey<ItemType> {
  (item: ItemType): string | Array<string>;
}

interface IndexedItem<ItemType> {
  item: ItemType;
  index: number;
}

interface RankedItem<ItemType> extends RankingInfo, IndexedItem<ItemType> {}

interface BaseSorter<ItemType> {
  (a: RankedItem<ItemType>, b: RankedItem<ItemType>): number;
}

interface Sorter<ItemType> {
  (matchItems: Array<RankedItem<ItemType>>): Array<RankedItem<ItemType>>;
}

interface KeyAttributesOptions<ItemType> {
  key?: string | ValueGetterKey<ItemType>;
  threshold?: Ranking;
  maxRanking?: Ranking;
  minRanking?: Ranking;
}

type KeyOption<ItemType> =
  | KeyAttributesOptions<ItemType>
  | ValueGetterKey<ItemType>
  | string;

interface MatchSorterOptions<ItemType = unknown> {
  keys?: ReadonlyArray<KeyOption<ItemType>>;
  threshold?: Ranking;
  baseSort?: BaseSorter<ItemType>;
  keepDiacritics?: boolean;
  sorter?: Sorter<ItemType>;
}
type IndexableByString = Record<string, unknown>;

const RANKING_CASE_SENSITIVE_EQUAL = 7;
const RANKING_EQUAL = 6;
const RANKING_STARTS_WITH = 5;
const RANKING_WORD_STARTS_WITH = 4;
const RANKING_CONTAINS = 3;
const RANKING_ACRONYM = 2;
const RANKING_MATCHES = 1;
const RANKING_NO_MATCH = 0;

type Ranking =
  | typeof RANKING_CASE_SENSITIVE_EQUAL
  | typeof RANKING_EQUAL
  | typeof RANKING_STARTS_WITH
  | typeof RANKING_WORD_STARTS_WITH
  | typeof RANKING_CONTAINS
  | typeof RANKING_ACRONYM
  | typeof RANKING_MATCHES
  | typeof RANKING_NO_MATCH;

let defaultBaseSortFn: BaseSorter<unknown> = (a, b) =>
  String(a.rankedValue).localeCompare(String(b.rankedValue));

/**
 * Takes an array of items and a value and returns a new array with the items that match the given value
 *
 * @borrows [kentcdodds/match-sorter](https://github.com/kentcdodds/match-sorter)
 *
 * @param {Array} items - the items to sort
 * @param {String} value - the value to use for ranking
 * @param {Object} options - Some options to configure the sorter
 * @return {Array} - the new sorted array
 */
let matchSorter = <ItemType = string>(
  items: ReadonlyArray<ItemType>,
  value: string,
  options: MatchSorterOptions<ItemType> = {},
): Array<ItemType> => {
  const {
    keys,
    threshold = RANKING_MATCHES,
    baseSort = defaultBaseSortFn,
    sorter = (matchedItems) =>
      matchedItems.sort((a, b) => sortRankedValues(a, b, baseSort)),
  } = options;
  const matchedItems = items.reduce(reduceItemsToRanked, []);
  return sorter(matchedItems).map(({ item }) => item);

  function reduceItemsToRanked(
    matches: Array<RankedItem<ItemType>>,
    item: ItemType,
    index: number,
  ): Array<RankedItem<ItemType>> {
    const rankingInfo = getHighestRanking(item, keys, value, options);
    const { rank, keyThreshold = threshold } = rankingInfo;
    if (rank >= keyThreshold) {
      matches.push({ ...rankingInfo, item, index });
    }
    return matches;
  }
};

/**
 * Gets the highest ranking for value for the given item based on its values for the given keys
 * @param {*} item - the item to rank
 * @param {Array} keys - the keys to get values from the item for the ranking
 * @param {String} value - the value to rank against
 * @param {Object} options - options to control the ranking
 * @return {{rank: Number, keyIndex: Number, keyThreshold: Number}} - the highest ranking
 */
let getHighestRanking = <ItemType>(
  item: ItemType,
  keys: ReadonlyArray<KeyOption<ItemType>> | undefined,
  value: string,
  options: MatchSorterOptions<ItemType>,
): RankingInfo => {
  if (!keys) {
    // if keys is not specified, then we assume the item given is ready to be matched
    const stringItem = item as unknown as string;
    return {
      // ends up being duplicate of 'item' in matches but consistent
      rankedValue: stringItem,
      rank: getMatchRanking(stringItem, value, options),
      keyIndex: -1,
      keyThreshold: options.threshold,
    };
  }
  const valuesToRank = getAllValuesToRank(item, keys);
  return valuesToRank.reduce(
    (
      { rank, rankedValue, keyIndex, keyThreshold },
      { itemValue, attributes },
      i,
    ) => {
      let newRank = getMatchRanking(itemValue, value, options);
      let newRankedValue = rankedValue;
      const { minRanking, maxRanking, threshold } = attributes;
      if (newRank < minRanking && newRank >= RANKING_MATCHES) {
        newRank = minRanking;
      } else if (newRank > maxRanking) {
        newRank = maxRanking;
      }
      if (newRank > rank) {
        rank = newRank;
        keyIndex = i;
        keyThreshold = threshold;
        newRankedValue = itemValue;
      }
      return { rankedValue: newRankedValue, rank, keyIndex, keyThreshold };
    },
    {
      rankedValue: item as unknown as string,
      rank: RANKING_NO_MATCH as Ranking,
      keyIndex: -1,
      keyThreshold: options.threshold,
    },
  );
};

/**
 * Gives a rankings score based on how well the two strings match.
 * @param {String} testString - the string to test against
 * @param {String} stringToRank - the string to rank
 * @param {Object} options - options for the match (like keepDiacritics for comparison)
 * @returns {Number} the ranking for how well stringToRank matches testString
 */
let getMatchRanking = <ItemType>(
  testString: string,
  stringToRank: string,
  options: MatchSorterOptions<ItemType>,
): Ranking => {
  testString = prepareValueForComparison(testString, options);
  stringToRank = prepareValueForComparison(stringToRank, options);

  // too long
  if (stringToRank.length > testString.length) {
    return RANKING_NO_MATCH;
  }

  // case sensitive equals
  if (testString === stringToRank) {
    return RANKING_CASE_SENSITIVE_EQUAL;
  }

  // Lower casing before further comparison
  testString = testString.toLowerCase();
  stringToRank = stringToRank.toLowerCase();

  // case insensitive equals
  if (testString === stringToRank) {
    return RANKING_EQUAL;
  }

  // starts with
  if (testString.startsWith(stringToRank)) {
    return RANKING_STARTS_WITH;
  }

  // word starts with
  if (testString.includes(` ${stringToRank}`)) {
    return RANKING_WORD_STARTS_WITH;
  }

  // contains
  if (testString.includes(stringToRank)) {
    return RANKING_CONTAINS;
  } else if (stringToRank.length === 1) {
    // If the only character in the given stringToRank
    //   isn't even contained in the testString, then
    //   it's definitely not a match.
    return RANKING_NO_MATCH;
  }

  // acronym
  if (getAcronym(testString).includes(stringToRank)) {
    return RANKING_ACRONYM;
  }

  // will return a number between RANKING_MATCHES and
  // RANKING_MATCHES + 1 depending  on how close of a match it is.
  return getClosenessRanking(testString, stringToRank);
};

/**
 * Generates an acronym for a string.
 *
 * @param {String} string the string for which to produce the acronym
 * @returns {String} the acronym
 */
let getAcronym = (string: string): string => {
  let acronym = "";
  const wordsInString = string.split(" ");
  wordsInString.forEach((wordInString) => {
    const splitByHyphenWords = wordInString.split("-");
    splitByHyphenWords.forEach((splitByHyphenWord) => {
      acronym += splitByHyphenWord.substring(0, 1);
    });
  });
  return acronym;
};

/**
 * Returns a score based on how spread apart the
 * characters from the stringToRank are within the testString.
 * A number close to RANKING_MATCHES represents a loose match. A number close
 * to RANKING_MATCHES + 1 represents a tighter match.
 * @param {String} testString - the string to test against
 * @param {String} stringToRank - the string to rank
 * @returns {Number} the number between RANKING_MATCHES and
 * RANKING_MATCHES + 1 for how well stringToRank matches testString
 */
let getClosenessRanking = (
  testString: string,
  stringToRank: string,
): Ranking => {
  let matchingInOrderCharCount = 0;
  let charNumber = 0;
  function findMatchingCharacter(
    matchChar: string,
    string: string,
    index: number,
  ) {
    for (let j = index, J = string.length; j < J; j++) {
      const stringChar = string[j];
      if (stringChar === matchChar) {
        matchingInOrderCharCount += 1;
        return j + 1;
      }
    }
    return -1;
  }
  function getRanking(spread: number) {
    const spreadPercentage = 1 / spread;
    const inOrderPercentage = matchingInOrderCharCount / stringToRank.length;
    const ranking = RANKING_MATCHES + inOrderPercentage * spreadPercentage;
    return ranking as Ranking;
  }
  const firstIndex = findMatchingCharacter(stringToRank[0], testString, 0);
  if (firstIndex < 0) {
    return RANKING_NO_MATCH;
  }
  charNumber = firstIndex;
  for (let i = 1, I = stringToRank.length; i < I; i++) {
    const matchChar = stringToRank[i];
    charNumber = findMatchingCharacter(matchChar, testString, charNumber);
    const found = charNumber > -1;
    if (!found) {
      return RANKING_NO_MATCH;
    }
  }

  const spread = charNumber - firstIndex;
  return getRanking(spread);
};

/**
 * Sorts items that have a rank, index, and keyIndex
 * @param {Object} a - the first item to sort
 * @param {Object} b - the second item to sort
 * @return {Number} -1 if a should come first, 1 if b should come first, 0 if equal
 */
let sortRankedValues = <ItemType>(
  a: RankedItem<ItemType>,
  b: RankedItem<ItemType>,
  baseSort: BaseSorter<ItemType>,
): number => {
  const aFirst = -1;
  const bFirst = 1;
  const { rank: aRank, keyIndex: aKeyIndex } = a;
  const { rank: bRank, keyIndex: bKeyIndex } = b;
  const same = aRank === bRank;
  if (same) {
    if (aKeyIndex === bKeyIndex) {
      // use the base sort function as a tie-breaker
      return baseSort(a, b);
    } else {
      return aKeyIndex < bKeyIndex ? aFirst : bFirst;
    }
  } else {
    return aRank > bRank ? aFirst : bFirst;
  }
};

/**
 * Prepares value for comparison by stringifying it, removing diacritics (if specified)
 * @param {String} value - the value to clean
 * @param {Object} options - {keepDiacritics: whether to remove diacritics}
 * @return {String} the prepared value
 */
let prepareValueForComparison = <ItemType>(
  value: string,
  { keepDiacritics }: MatchSorterOptions<ItemType>,
): string => {
  // value might not actually be a string at this point (we don't get to choose)
  // so part of preparing the value for comparison is ensure that it is a string
  value = `${value}`; // toString
  if (!keepDiacritics) {
    value = removeAccents(value);
  }
  return value;
};

/**
 * Gets value for key in item at arbitrarily nested keypath
 * @param {Object} item - the item
 * @param {Object|Function} key - the potentially nested keypath or property callback
 * @return {Array} - an array containing the value(s) at the nested keypath
 */
let getItemValues = <ItemType>(
  item: ItemType,
  key: KeyOption<ItemType>,
): Array<string> => {
  if (typeof key === "object") {
    key = key.key as string;
  }
  let value: string | Array<string> | null | unknown;
  if (typeof key === "function") {
    value = key(item);
  } else if (item == null) {
    value = null;
  } else if (Object.hasOwnProperty.call(item, key)) {
    value = (item as IndexableByString)[key];
  } else if (key.includes(".")) {
    return getNestedValues<ItemType>(key, item);
  } else {
    value = null;
  }

  // because `value` can also be undefined
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [String(value)];
};

/**
 * Given path: "foo.bar.baz"
 * And item: {foo: {bar: {baz: 'buzz'}}}
 *   -> 'buzz'
 * @param path a dot-separated set of keys
 * @param item the item to get the value from
 */
let getNestedValues = <ItemType>(
  path: string,
  item: ItemType,
): Array<string> => {
  const keys = path.split(".");

  type ValueA = Array<ItemType | IndexableByString | string>;
  let values: ValueA = [item];

  for (let i = 0, I = keys.length; i < I; i++) {
    const nestedKey = keys[i];
    let nestedValues: ValueA = [];

    for (let j = 0, J = values.length; j < J; j++) {
      const nestedItem = values[j];

      if (nestedItem == null) continue;

      if (Object.hasOwnProperty.call(nestedItem, nestedKey)) {
        const nestedValue = (nestedItem as IndexableByString)[nestedKey];
        if (nestedValue != null) {
          nestedValues.push(nestedValue as IndexableByString | string);
        }
      } else if (nestedKey === "*") {
        // ensure that values is an array
        nestedValues = nestedValues.concat(nestedItem);
      }
    }

    values = nestedValues;
  }

  if (Array.isArray(values[0])) {
    // keep allowing the implicit wildcard for an array of strings at the end of
    // the path; don't use `.flat()` because that's not available in node.js v10
    const result: Array<string> = [];
    return result.concat(...(values as Array<string>));
  }
  // Based on our logic it should be an array of strings by now...
  // assuming the user's path terminated in strings
  return values as Array<string>;
};

/**
 * Gets all the values for the given keys in the given item and returns an array of those values
 * @param item - the item from which the values will be retrieved
 * @param keys - the keys to use to retrieve the values
 * @return objects with {itemValue, attributes}
 */
let getAllValuesToRank = <ItemType>(
  item: ItemType,
  keys: ReadonlyArray<KeyOption<ItemType>>,
) => {
  const allValues: Array<{ itemValue: string; attributes: KeyAttributes }> = [];
  for (let j = 0, J = keys.length; j < J; j++) {
    const key = keys[j];
    const attributes = getKeyAttributes(key);
    const itemValues = getItemValues(item, key);
    for (let i = 0, I = itemValues.length; i < I; i++) {
      allValues.push({
        itemValue: itemValues[i],
        attributes,
      });
    }
  }
  return allValues;
};

const defaultKeyAttributes = {
  maxRanking: Infinity as Ranking,
  minRanking: -Infinity as Ranking,
};
/**
 * Gets all the attributes for the given key
 * @param key - the key from which the attributes will be retrieved
 * @return object containing the key's attributes
 */
let getKeyAttributes = <ItemType>(key: KeyOption<ItemType>): KeyAttributes =>
  isString(key) ? defaultKeyAttributes : { ...defaultKeyAttributes, ...key };

export { matchSorter, defaultBaseSortFn };

export type {
  MatchSorterOptions,
  KeyAttributesOptions,
  KeyOption,
  KeyAttributes,
  RankingInfo,
  ValueGetterKey,
};

export default matchSorter;
