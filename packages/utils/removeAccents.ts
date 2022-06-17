import { type AccentsSet, accentsSets } from "./accentSets";

/**
 * @category text
 */
export function removeAccents(text = "", sets: AccentsSet[] = accentsSets) {
  let len = sets.length;
  while (len--) {
    const [to, from] = sets[len];
    text = text.replace(new RegExp(`[${from}]`, "gi"), to);
  }
  return text;
}

export default removeAccents;
