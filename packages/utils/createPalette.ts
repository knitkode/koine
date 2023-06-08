type PaletteShade = readonly [number, string];

type PaletteShades = readonly PaletteShade[];

type PaletteMapPair<T extends PaletteShade> = {
  [Pair in T as `${Pair[0]}`]: Pair[1];
};

type PaletteMap<T extends PaletteShades> = {
  [PS in T[number] as keyof PaletteMapPair<PS>]: PaletteMapPair<PS>[keyof PaletteMapPair<PS>];
};

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
  TShades extends PaletteShades,
  TColor = TShades[number][1],
  TMap = PaletteMap<TShades>
>(
  name: TName,
  shades: TShades
) => {
  const map = shades.reduce((map, def) => {
    map[def[0]] = def[1] as TColor;
    return map;
  }, {} as { [s: string]: TColor });

  const tailwindPalette = shades.reduce((map, def) => {
    map[`${name}-${def[0]}`] = def[1];
    return map;
  }, {} as Record<`${TName}-${TShades[number][0]}`, string>);

  return [map as TMap, tailwindPalette, Object.values<TColor>(map)] as const;
};

export default createPalette;
