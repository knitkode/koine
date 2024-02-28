export let routeHasDynamicPortion = (routeIdOrPortion: string) =>
  /\[/.test(routeIdOrPortion);

export default routeHasDynamicPortion;
