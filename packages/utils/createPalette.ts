/**
 * Create palette, this is primarily thought to improve the reuse of a palette
 * definition between TailwindCSS and straight ES imports
 *
 * @category styling|tailwind|colours
 *
 * @returns An array with: 1) A flat palette map 2) A TailwindCSS ready palette
 * object 3) A flat array of colors (no special sorting, same order as the `shades`
 * given as argument)
 */
export const createPalette = <
  TName extends string,
  TShades extends readonly (readonly [number, string])[],
  TShade extends number = TShades[number][0]
>(
  name: TName,
  shades: TShades
) => {
  const map = shades.reduce((map, def) => {
    map[def[0] as TShade] = def[1];
    return map;
  }, {} as Record<TShade, string>);

  const tailwindPalette = shades.reduce((map, def) => {
    map[`${name}-${def[0]}`] = def[1];
    return map;
  }, {} as Record<`${TName}-${TShades[number][0]}`, string>);

  return [map, tailwindPalette, Object.values(map)] as const;
};

export default createPalette;
