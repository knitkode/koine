export const sortObjectKeysMatching = <T extends object>(
  data: T,
  keyMatch: keyof T,
) => {
  return Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => {
      return a === keyMatch ? -1 : a.localeCompare(b);
    }),
  );
};
