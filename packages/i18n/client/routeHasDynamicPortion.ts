export let routeHasDynamicPortion = (routeIdOrPortion: string) =>
  /\[/.test(routeIdOrPortion);
