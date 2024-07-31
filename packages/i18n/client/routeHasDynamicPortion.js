"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHasDynamicPortion = void 0;
const routeHasDynamicPortion = function (routeIdOrPortion) {
  return /\[/.test(routeIdOrPortion);
};
exports.routeHasDynamicPortion = routeHasDynamicPortion;
exports.default = exports.routeHasDynamicPortion;
