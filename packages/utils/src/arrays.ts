/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @see lodash.shuffle
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * shuffle([1, 2, 3, 4])
 * // => [4, 1, 3, 2]
 */
export function shuffle<T>(array: T[]) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  let index = -1;
  const lastIndex = length - 1;
  const result = [...array] as T[];
  while (++index < length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
}

/**
 * Maps an array of objects into a map keyed with the given key
 */
export function mapListBy<T extends Record<string | number | symbol, any>>(
  array: T[] = [] as T[],
  key: keyof T = "" as keyof T
) {
  return array.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {} as Record<T[keyof T], T>);
}

/**
 * Maps a simple flat array to a lookup dictionary object
 */
export function arrayToLookup<T extends string | number | symbol>(
  array: T[] = [] as T[]
) {
  return array.reduce((obj, item) => {
    obj[item] = 1;
    return obj;
  }, {} as Record<T, 1>);
}

/**
 * Remove duplicated array objects, equality is determined by a strict (`===`)
 * comparison of each object's given key
 */
export function removeDuplicatesByKey<
  T extends Record<string | number | symbol, any>
>(array: T[] = [] as T[], key: keyof T = "" as keyof T) {
  const keysMap = {} as Record<T[keyof T], boolean>;
  const output: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!keysMap[item[key]]) {
      output.push(item);
      keysMap[item[key]] = true;
    }
  }

  return output;
}

export function addOrReplaceAtIdx<T>(
  list: T[],
  newItem: T,
  newIdx?: number
): T[] {
  if (list.length === 0) {
    return [newItem];
  }

  if (typeof newIdx === "undefined" || list.length - 1 < newIdx) {
    return [...list, newItem];
  }

  return list.map((item, idx) => {
    if (idx === newIdx) {
      return newItem;
    }
    return item;
  });
}

/**
 * @see https://stackoverflow.com/a/40682136/1938970
 */
export function chunkBySize<T>(arr: T[], size: number): T[][] {
  const output = [];
  for (let i = 0; i < arr.length; i += size) {
    output.push(arr.slice(i, i + size));
  }
  return output;
}

/**
 * TODO: untested
 * @see https://stackoverflow.com/a/8189268/1938970
 */
export function chunkByChunks<T>(
  arr: T[],
  nrOfChunks: number,
  balanced?: boolean
): T[][] {
  if (nrOfChunks < 2) return [arr];

  const len = arr.length;
  const output = [];
  let i = 0;
  let size;

  if (len % nrOfChunks === 0) {
    size = Math.floor(len / nrOfChunks);
    while (i < len) {
      output.push(arr.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / nrOfChunks--);
      output.push(arr.slice(i, (i += size)));
    }
  } else {
    nrOfChunks--;
    size = Math.floor(len / nrOfChunks);
    if (len % size === 0) size--;
    while (i < size * nrOfChunks) {
      output.push(arr.slice(i, (i += size)));
    }
    output.push(arr.slice(size * nrOfChunks));
  }

  return output;
}

export function removeDuplicatesComparing<T>(from: any[], to: T[]) {
  const indexes = findDuplicatedIndexes(from);
  return removeIndexesFromArray<T>(to, indexes);
}

export function findDuplicatedIndexes(arr: any[]) {
  const indexes: Record<number, true> = {};
  for (let i = 0; i < arr.length; i++) {
    const idxInArray = arr.indexOf(arr[i]);
    if (idxInArray !== i && idxInArray !== -1) {
      indexes[i] = true;
    }
  }

  return indexes;
}

export function removeIndexesFromArray<T>(
  arr: T[],
  indexes: Record<number, true>
) {
  const output: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    // eslint-disable-next-line no-prototype-builtins
    if (!indexes.hasOwnProperty(i)) {
      output.push(arr[i]);
    }
  }
  return output;
}
