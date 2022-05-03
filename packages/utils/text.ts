/**
 * First value is the `to`, second is `from`, from *which* chars do we translates *to*
 */
export type AccentsSet = [string, string];

/**
 * Accent sets
 *
 * @see https://gist.github.com/mathewbyrne/1280286#gistcomment-3498021
 * @see https://gist.github.com/eek/9c4887e80b3ede05c0e39fee4dce3747 for usage
 * of [normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
 */
const ACCENTS_SETS: AccentsSet[] = [
  ["a", "ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ"],
  ["ae", "Ä"],
  ["c", "ÇĆĈČ"],
  ["d", "ÐĎĐÞ"],
  ["e", "ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ"],
  ["g", "ĜĞĢǴ"],
  ["h", "ĤḦ"],
  ["i", "ÌÍÎÏĨĪĮİỈỊ"],
  ["j", "Ĵ"],
  ["ij", "Ĳ"],
  ["k", "Ķ"],
  ["l", "ĹĻĽŁ"],
  ["m", "Ḿ"],
  ["n", "ÑŃŅŇ"],
  ["o", "ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ"],
  ["oe", "ŒÖ"],
  ["p", "ṕ"],
  ["r", "ŔŖŘ"],
  ["s", "ŚŜŞŠ"],
  ["ss", "ß"],
  ["t", "ŢŤ"],
  ["u", "ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯ"],
  ["ue", "Ü"],
  ["w", "ẂŴẀẄ"],
  ["x", "ẍ"],
  ["y", "ÝŶŸỲỴỶỸ"],
  ["z", "ŹŻŽ"],
];

export function removeAccents(text = "", sets: AccentsSet[] = ACCENTS_SETS) {
  let len = sets.length;
  while (len--) {
    const [to, from] = sets[len];
    text = text.replace(new RegExp(`[${from}]`, "gi"), to);
  }
  return text;
}

/**
 * Slugify a text
 *
 * - replaces the accented letters
 * - replaces the punctuation with dashes
 *
 * @see https://gist.github.com/mathewbyrne/1280286#gistcomment-3498021
 */
export function slugify(text: string, separator = "-") {
  return removeAccents(
    text.toString().toLowerCase().trim(),
    ACCENTS_SETS.concat([["-", "[·/_,:;']"]])
  )
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/&/g, "-and-") // replace & with 'and'
    .replace(/[^\w-]+/g, "") // remove all non-word chars
    .replace(/--+/g, "-") // replace multiple - with single -
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, "") // trim - from end of text
    .replace(/-/g, separator);
}
