export function routeHasDynamicPortion(routeIdOrPortion: string) {
  return /\[/.test(routeIdOrPortion);
}

export default routeHasDynamicPortion;
